module.exports = {

"[project]/node_modules/.pnpm/@apollo+server@4.12.1_graphql@16.11.0/node_modules/@apollo/server/dist/esm/plugin/disableSuggestions/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ApolloServerPluginDisableSuggestions": (()=>ApolloServerPluginDisableSuggestions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$server$40$4$2e$12$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$apollo$2f$server$2f$dist$2f$esm$2f$internalPlugin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@apollo+server@4.12.1_graphql@16.11.0/node_modules/@apollo/server/dist/esm/internalPlugin.js [app-route] (ecmascript)");
;
function ApolloServerPluginDisableSuggestions() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$apollo$2b$server$40$4$2e$12$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$apollo$2f$server$2f$dist$2f$esm$2f$internalPlugin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["internalPlugin"])({
        __internal_plugin_id__: 'DisableSuggestions',
        __is_disabled_plugin__: false,
        async requestDidStart () {
            return {
                async validationDidStart () {
                    return async (validationErrors)=>{
                        validationErrors?.forEach((error)=>{
                            error.message = error.message.replace(/ ?Did you mean(.+?)\?$/, '');
                        });
                    };
                }
            };
        }
    });
} //# sourceMappingURL=index.js.map
}}),

};

//# sourceMappingURL=1a43c_%40apollo_server_dist_esm_plugin_disableSuggestions_index_a906fc83.js.map