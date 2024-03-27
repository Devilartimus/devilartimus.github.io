"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vite_1 = require("@vueuse/schema-org-vite/vite");
const Sentry = require("@sentry/vue");
const tracing_1 = require("@sentry/tracing");
const vue_2 = require("virtual:pwa-register/vue");
const head_1 = require("@vueuse/head");
const pinia_1 = require("pinia");
const better_write_plugin_core_1 = require("better-write-plugin-core");
const vue3_pdfmake_1 = require("vue3-pdfmake");
const vue_directive_providers_1 = require("vue-directive-providers");
const motion_1 = require("@vueuse/motion");
const floating_vue_1 = require("floating-vue");
const vue_toastification_1 = require("vue-toastification");
const mitt_1 = require("mitt");
const env_1 = require("./use/env");
const router_1 = require("./router");
const lang_1 = require("./lang");
const App_vue_1 = require("./App.vue");
require("virtual:windi.css");
require("@milkdown/prose/view/style/prosemirror.css");
require("@milkdown/prose/tables/style/tables.css");
require("floating-vue/dist/style.css");
require("vue-toastification/dist/index.css");
require("better-write-plugin-theme/css/inject.css");
const env = env_1.useEnv();
const app = vue_1.createApp(App_vue_1.default);
exports.head = head_1.createHead();
exports.store = pinia_1.createPinia();
exports.core = better_write_plugin_core_1.createPluginCore();
exports.emitter = mitt_1.default();
app.config.globalProperties.emitter = exports.emitter;
app.use(vue3_pdfmake_1.PDFPlugin);
app.use(router_1.default);
app.use(exports.store);
app.use(lang_1.default);
app.use(motion_1.MotionPlugin);
app.use(exports.head);
app.use(exports.core);
app.use(vue_directive_providers_1.ProviderPlugin);
app.use(floating_vue_1.default, {
    themes: {
        'better-write': {
            $extend: 'tooltip',
            $resetCss: true,
        },
    },
});
app.use(vue_toastification_1.default, {
    position: vue_toastification_1.POSITION.TOP_RIGHT,
    timeout: 4000,
    maxToasts: 3,
});
vue_2.useRegisterSW({
    onRegistered(r) {
        r &&
            setInterval(() => {
                r.update();
            }, 60 * 30 * 1000);
    },
});
// @ts-ignore
const { t } = lang_1.default.global;
if (!env.isDev()) {
    Sentry.init({
        app,
        dsn: env.getSentryDsn(),
        integrations: [
            new tracing_1.BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router_1.default),
                tracingOrigins: [env.getProdUrl(), /^\//],
            }),
        ],
        beforeSend(event, _) {
            if (event.exception) {
                Sentry.showReportDialog({
                    eventId: event.event_id,
                    // @ts-ignore
                    title: t('plugin.sentry.errorWidget.title'),
                    // @ts-ignore
                    subtitle: t('plugin.sentry.errorWidget.subtitle'),
                    // @ts-ignore
                    subtitle2: t('plugin.sentry.errorWidget.subtitle2'),
                    // @ts-ignore
                    labelName: t('plugin.sentry.errorWidget.labelName'),
                    // @ts-ignore
                    labelEmail: t('plugin.sentry.errorWidget.labelEmail'),
                    // @ts-ignore
                    labelComments: t('plugin.sentry.errorWidget.labelComments'),
                    // @ts-ignore
                    labelClose: t('plugin.sentry.errorWidget.labelClose'),
                    // @ts-ignore
                    labelSubmit: t('plugin.sentry.errorWidget.labelSubmit'),
                    // @ts-ignore
                    errorGeneric: t('plugin.sentry.errorWidget.errorGeneric'),
                    // @ts-ignore
                    errorFormEntry: t('plugin.sentry.errorWidget.errorFormEntry'),
                    // @ts-ignore
                    successMessage: t('plugin.sentry.errorWidget.successMessage'),
                });
            }
            return event;
        },
        logErrors: true,
        tracesSampleRate: 0.5,
        trackComponents: true,
        hooks: ['activate', 'mount', 'update', 'destroy', 'create'],
    });
}
vite_1.installSchemaOrg({ app, router: router_1.default }, {
    canonicalHost: env.getProdUrl()
} `https://${string}`, defaultLanguage, 'pt-BR');
router_1.default.isReady().then(() => app.mount('#app'));
