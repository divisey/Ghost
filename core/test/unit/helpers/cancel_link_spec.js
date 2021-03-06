const should = require('should');
const hbs = require('../../../frontend/services/themes/engine');
const helpers = require('../../../frontend/helpers');
const configUtils = require('../../utils/configUtils');

describe('{{cancel_link}} helper', function () {
    before(function (done) {
        hbs.express4({partialsDir: [configUtils.config.get('paths').helperTemplates]});

        hbs.cachePartials(function () {
            done();
        });
    });

    const defaultLinkClass = /class="gh-subscription-cancel"/;
    const defaultErrorElementClass = /class="gh-error gh-error-subscription-cancel"/;
    const defaultCancelLinkText = /Cancel subscription/;
    const defaultContinueLinkText = /Continue subscription/;

    it('should throw if subscription data is incorrect', function () {
        var runHelper = function (data) {
                return function () {
                    helpers.cancel_link.call(data);
                };
            }, expectedMessage = 'The {{cancel_link}} helper was used outside of a subscription context. See https://ghost.org/docs/api/handlebars-themes/helpers/cancel_link/.';

        runHelper('not an object').should.throwError(expectedMessage);
        runHelper(function () {
        }).should.throwError(expectedMessage);
    });

    it('can render cancel subscription link', function () {
        const rendered = helpers.cancel_link.call({
            id: 'sub_cancel',
            cancel_at_period_end: false
        });
        should.exist(rendered);

        rendered.string.should.match(defaultLinkClass);
        rendered.string.should.match(/data-members-cancel-subscription="sub_cancel"/);
        rendered.string.should.match(defaultCancelLinkText);

        rendered.string.should.match(defaultErrorElementClass);
    });

    it('can render continue subscription link', function () {
        const rendered = helpers.cancel_link.call({
            id: 'sub_continue',
            cancel_at_period_end: true
        });
        should.exist(rendered);

        rendered.string.should.match(defaultLinkClass);
        rendered.string.should.match(/data-members-continue-subscription="sub_continue"/);
        rendered.string.should.match(defaultContinueLinkText);
    });

    it('can render custom link class', function () {
        const rendered = helpers.cancel_link.call({
            id: 'sub_cancel',
            cancel_at_period_end: false
        }, {
            hash: {
                class: 'custom-link-class'
            }
        });
        should.exist(rendered);

        rendered.string.should.match(/custom-link-class/);
    });

    it('can render custom error class', function () {
        const rendered = helpers.cancel_link.call({
            id: 'sub_cancel',
            cancel_at_period_end: false
        }, {
            hash: {
                errorClass: 'custom-error-class'
            }
        });
        should.exist(rendered);

        rendered.string.should.match(/custom-error-class/);
    });

    it('can render custom cancel subscription link attributes', function () {
        const rendered = helpers.cancel_link.call({
            id: 'sub_cancel',
            cancel_at_period_end: false
        }, {
            hash: {
                cancelLabel: 'custom cancel link text'
            }
        });
        should.exist(rendered);

        rendered.string.should.match(/custom cancel link text/);
    });

    it('can render custom continue subscription link attributes', function () {
        const rendered = helpers.cancel_link.call({
            id: 'sub_cancel',
            cancel_at_period_end: true
        }, {
            hash: {
                continueLabel: 'custom continue link text'
            }
        });
        should.exist(rendered);

        rendered.string.should.match(/custom continue link text/);
    });
});
