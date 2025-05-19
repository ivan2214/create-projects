module.exports = {

"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/merge-resolvers.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeResolvers = void 0;
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
/**
 * Deep merges multiple resolver definition objects into a single definition.
 * @param resolversDefinitions Resolver definitions to be merged
 * @param options Additional options
 *
 * ```js
 * const { mergeResolvers } = require('@graphql-tools/merge');
 * const clientResolver = require('./clientResolver');
 * const productResolver = require('./productResolver');
 *
 * const resolvers = mergeResolvers([
 *  clientResolver,
 *  productResolver,
 * ]);
 * ```
 *
 * If you don't want to manually create the array of resolver objects, you can
 * also use this function along with loadFiles:
 *
 * ```js
 * const path = require('path');
 * const { mergeResolvers } = require('@graphql-tools/merge');
 * const { loadFilesSync } = require('@graphql-tools/load-files');
 *
 * const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
 *
 * const resolvers = mergeResolvers(resolversArray)
 * ```
 */ function mergeResolvers(resolversDefinitions, options) {
    if (!resolversDefinitions || Array.isArray(resolversDefinitions) && resolversDefinitions.length === 0) {
        return {};
    }
    if (!Array.isArray(resolversDefinitions)) {
        return resolversDefinitions;
    }
    if (resolversDefinitions.length === 1) {
        return resolversDefinitions[0] || {};
    }
    const resolvers = new Array();
    for (let resolversDefinition of resolversDefinitions){
        if (Array.isArray(resolversDefinition)) {
            resolversDefinition = mergeResolvers(resolversDefinition);
        }
        if (typeof resolversDefinition === 'object' && resolversDefinition) {
            resolvers.push(resolversDefinition);
        }
    }
    const result = (0, utils_1.mergeDeep)(resolvers, true);
    if (options === null || options === void 0 ? void 0 : options.exclusions) {
        for (const exclusion of options.exclusions){
            const [typeName, fieldName] = exclusion.split('.');
            if (!fieldName || fieldName === '*') {
                delete result[typeName];
            } else if (result[typeName]) {
                delete result[typeName][fieldName];
            }
        }
    }
    return result;
}
exports.mergeResolvers = mergeResolvers;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/arguments.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeArguments = void 0;
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
function mergeArguments(args1, args2, config) {
    const result = deduplicateArguments([
        ...args2,
        ...args1
    ].filter(utils_1.isSome), config);
    if (config && config.sort) {
        result.sort(utils_1.compareNodes);
    }
    return result;
}
exports.mergeArguments = mergeArguments;
function deduplicateArguments(args, config) {
    return args.reduce((acc, current)=>{
        const dupIndex = acc.findIndex((arg)=>arg.name.value === current.name.value);
        if (dupIndex === -1) {
            return acc.concat([
                current
            ]);
        } else if (!(config === null || config === void 0 ? void 0 : config.reverseArguments)) {
            acc[dupIndex] = current;
        }
        return acc;
    }, []);
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeDirective = exports.mergeDirectives = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
function directiveAlreadyExists(directivesArr, otherDirective) {
    return !!directivesArr.find((directive)=>directive.name.value === otherDirective.name.value);
}
function isRepeatableDirective(directive, directives) {
    var _a;
    return !!((_a = directives === null || directives === void 0 ? void 0 : directives[directive.name.value]) === null || _a === void 0 ? void 0 : _a.repeatable);
}
function nameAlreadyExists(name, namesArr) {
    return namesArr.some(({ value })=>value === name.value);
}
function mergeArguments(a1, a2) {
    const result = [
        ...a2
    ];
    for (const argument of a1){
        const existingIndex = result.findIndex((a)=>a.name.value === argument.name.value);
        if (existingIndex > -1) {
            const existingArg = result[existingIndex];
            if (existingArg.value.kind === 'ListValue') {
                const source = existingArg.value.values;
                const target = argument.value.values;
                // merge values of two lists
                existingArg.value.values = deduplicateLists(source, target, (targetVal, source)=>{
                    const value = targetVal.value;
                    return !value || !source.some((sourceVal)=>sourceVal.value === value);
                });
            } else {
                existingArg.value = argument.value;
            }
        } else {
            result.push(argument);
        }
    }
    return result;
}
function deduplicateDirectives(directives, definitions) {
    return directives.map((directive, i, all)=>{
        const firstAt = all.findIndex((d)=>d.name.value === directive.name.value);
        if (firstAt !== i && !isRepeatableDirective(directive, definitions)) {
            const dup = all[firstAt];
            directive.arguments = mergeArguments(directive.arguments, dup.arguments);
            return null;
        }
        return directive;
    }).filter(utils_1.isSome);
}
function mergeDirectives(d1 = [], d2 = [], config, directives) {
    const reverseOrder = config && config.reverseDirectives;
    const asNext = reverseOrder ? d1 : d2;
    const asFirst = reverseOrder ? d2 : d1;
    const result = deduplicateDirectives([
        ...asNext
    ], directives);
    for (const directive of asFirst){
        if (directiveAlreadyExists(result, directive) && !isRepeatableDirective(directive, directives)) {
            const existingDirectiveIndex = result.findIndex((d)=>d.name.value === directive.name.value);
            const existingDirective = result[existingDirectiveIndex];
            result[existingDirectiveIndex].arguments = mergeArguments(directive.arguments || [], existingDirective.arguments || []);
        } else {
            result.push(directive);
        }
    }
    return result;
}
exports.mergeDirectives = mergeDirectives;
function validateInputs(node, existingNode) {
    const printedNode = (0, graphql_1.print)({
        ...node,
        description: undefined
    });
    const printedExistingNode = (0, graphql_1.print)({
        ...existingNode,
        description: undefined
    });
    // eslint-disable-next-line
    const leaveInputs = new RegExp('(directive @w*d*)|( on .*$)', 'g');
    const sameArguments = printedNode.replace(leaveInputs, '') === printedExistingNode.replace(leaveInputs, '');
    if (!sameArguments) {
        throw new Error(`Unable to merge GraphQL directive "${node.name.value}". \nExisting directive:  \n\t${printedExistingNode} \nReceived directive: \n\t${printedNode}`);
    }
}
function mergeDirective(node, existingNode) {
    if (existingNode) {
        validateInputs(node, existingNode);
        return {
            ...node,
            locations: [
                ...existingNode.locations,
                ...node.locations.filter((name)=>!nameAlreadyExists(name, existingNode.locations))
            ]
        };
    }
    return node;
}
exports.mergeDirective = mergeDirective;
function deduplicateLists(source, target, filterFn) {
    return source.concat(target.filter((val)=>filterFn(val, source)));
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/enum-values.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeEnumValues = void 0;
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
function mergeEnumValues(first, second, config, directives) {
    if (config === null || config === void 0 ? void 0 : config.consistentEnumMerge) {
        const reversed = [];
        if (first) {
            reversed.push(...first);
        }
        first = second;
        second = reversed;
    }
    const enumValueMap = new Map();
    if (first) {
        for (const firstValue of first){
            enumValueMap.set(firstValue.name.value, firstValue);
        }
    }
    if (second) {
        for (const secondValue of second){
            const enumValue = secondValue.name.value;
            if (enumValueMap.has(enumValue)) {
                const firstValue = enumValueMap.get(enumValue);
                firstValue.description = secondValue.description || firstValue.description;
                firstValue.directives = (0, directives_js_1.mergeDirectives)(secondValue.directives, firstValue.directives, directives);
            } else {
                enumValueMap.set(enumValue, secondValue);
            }
        }
    }
    const result = [
        ...enumValueMap.values()
    ];
    if (config && config.sort) {
        result.sort(utils_1.compareNodes);
    }
    return result;
}
exports.mergeEnumValues = mergeEnumValues;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/enum.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeEnum = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const enum_values_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/enum-values.js [app-route] (ecmascript)");
function mergeEnum(e1, e2, config, directives) {
    if (e2) {
        return {
            name: e1.name,
            description: e1['description'] || e2['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || e1.kind === 'EnumTypeDefinition' || e2.kind === 'EnumTypeDefinition' ? 'EnumTypeDefinition' : 'EnumTypeExtension',
            loc: e1.loc,
            directives: (0, directives_js_1.mergeDirectives)(e1.directives, e2.directives, config, directives),
            values: (0, enum_values_js_1.mergeEnumValues)(e1.values, e2.values, config)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...e1,
        kind: graphql_1.Kind.ENUM_TYPE_DEFINITION
    } : e1;
}
exports.mergeEnum = mergeEnum;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/utils.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultStringComparator = exports.CompareVal = exports.printTypeNode = exports.isNonNullTypeNode = exports.isListTypeNode = exports.isWrappingTypeNode = exports.extractType = exports.isSourceTypes = exports.isStringTypes = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
function isStringTypes(types) {
    return typeof types === 'string';
}
exports.isStringTypes = isStringTypes;
function isSourceTypes(types) {
    return types instanceof graphql_1.Source;
}
exports.isSourceTypes = isSourceTypes;
function extractType(type) {
    let visitedType = type;
    while(visitedType.kind === graphql_1.Kind.LIST_TYPE || visitedType.kind === 'NonNullType'){
        visitedType = visitedType.type;
    }
    return visitedType;
}
exports.extractType = extractType;
function isWrappingTypeNode(type) {
    return type.kind !== graphql_1.Kind.NAMED_TYPE;
}
exports.isWrappingTypeNode = isWrappingTypeNode;
function isListTypeNode(type) {
    return type.kind === graphql_1.Kind.LIST_TYPE;
}
exports.isListTypeNode = isListTypeNode;
function isNonNullTypeNode(type) {
    return type.kind === graphql_1.Kind.NON_NULL_TYPE;
}
exports.isNonNullTypeNode = isNonNullTypeNode;
function printTypeNode(type) {
    if (isListTypeNode(type)) {
        return `[${printTypeNode(type.type)}]`;
    }
    if (isNonNullTypeNode(type)) {
        return `${printTypeNode(type.type)}!`;
    }
    return type.name.value;
}
exports.printTypeNode = printTypeNode;
var CompareVal;
(function(CompareVal) {
    CompareVal[CompareVal["A_SMALLER_THAN_B"] = -1] = "A_SMALLER_THAN_B";
    CompareVal[CompareVal["A_EQUALS_B"] = 0] = "A_EQUALS_B";
    CompareVal[CompareVal["A_GREATER_THAN_B"] = 1] = "A_GREATER_THAN_B";
})(CompareVal = exports.CompareVal || (exports.CompareVal = {}));
function defaultStringComparator(a, b) {
    if (a == null && b == null) {
        return CompareVal.A_EQUALS_B;
    }
    if (a == null) {
        return CompareVal.A_SMALLER_THAN_B;
    }
    if (b == null) {
        return CompareVal.A_GREATER_THAN_B;
    }
    if (a < b) return CompareVal.A_SMALLER_THAN_B;
    if (a > b) return CompareVal.A_GREATER_THAN_B;
    return CompareVal.A_EQUALS_B;
}
exports.defaultStringComparator = defaultStringComparator;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/fields.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeFields = void 0;
const utils_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/utils.js [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
const arguments_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/arguments.js [app-route] (ecmascript)");
function fieldAlreadyExists(fieldsArr, otherField) {
    const resultIndex = fieldsArr.findIndex((field)=>field.name.value === otherField.name.value);
    return [
        resultIndex > -1 ? fieldsArr[resultIndex] : null,
        resultIndex
    ];
}
function mergeFields(type, f1, f2, config, directives) {
    const result = [];
    if (f2 != null) {
        result.push(...f2);
    }
    if (f1 != null) {
        for (const field of f1){
            const [existing, existingIndex] = fieldAlreadyExists(result, field);
            if (existing && !(config === null || config === void 0 ? void 0 : config.ignoreFieldConflicts)) {
                const newField = (config === null || config === void 0 ? void 0 : config.onFieldTypeConflict) && config.onFieldTypeConflict(existing, field, type, config === null || config === void 0 ? void 0 : config.throwOnConflict) || preventConflicts(type, existing, field, config === null || config === void 0 ? void 0 : config.throwOnConflict);
                newField.arguments = (0, arguments_js_1.mergeArguments)(field['arguments'] || [], existing['arguments'] || [], config);
                newField.directives = (0, directives_js_1.mergeDirectives)(field.directives, existing.directives, config, directives);
                newField.description = field.description || existing.description;
                result[existingIndex] = newField;
            } else {
                result.push(field);
            }
        }
    }
    if (config && config.sort) {
        result.sort(utils_1.compareNodes);
    }
    if (config && config.exclusions) {
        const exclusions = config.exclusions;
        return result.filter((field)=>!exclusions.includes(`${type.name.value}.${field.name.value}`));
    }
    return result;
}
exports.mergeFields = mergeFields;
function preventConflicts(type, a, b, ignoreNullability = false) {
    const aType = (0, utils_js_1.printTypeNode)(a.type);
    const bType = (0, utils_js_1.printTypeNode)(b.type);
    if (aType !== bType) {
        const t1 = (0, utils_js_1.extractType)(a.type);
        const t2 = (0, utils_js_1.extractType)(b.type);
        if (t1.name.value !== t2.name.value) {
            throw new Error(`Field "${b.name.value}" already defined with a different type. Declared as "${t1.name.value}", but you tried to override with "${t2.name.value}"`);
        }
        if (!safeChangeForFieldType(a.type, b.type, !ignoreNullability)) {
            throw new Error(`Field '${type.name.value}.${a.name.value}' changed type from '${aType}' to '${bType}'`);
        }
    }
    if ((0, utils_js_1.isNonNullTypeNode)(b.type) && !(0, utils_js_1.isNonNullTypeNode)(a.type)) {
        a.type = b.type;
    }
    return a;
}
function safeChangeForFieldType(oldType, newType, ignoreNullability = false) {
    // both are named
    if (!(0, utils_js_1.isWrappingTypeNode)(oldType) && !(0, utils_js_1.isWrappingTypeNode)(newType)) {
        return oldType.toString() === newType.toString();
    }
    // new is non-null
    if ((0, utils_js_1.isNonNullTypeNode)(newType)) {
        const ofType = (0, utils_js_1.isNonNullTypeNode)(oldType) ? oldType.type : oldType;
        return safeChangeForFieldType(ofType, newType.type);
    }
    // old is non-null
    if ((0, utils_js_1.isNonNullTypeNode)(oldType)) {
        return safeChangeForFieldType(newType, oldType, ignoreNullability);
    }
    // old is list
    if ((0, utils_js_1.isListTypeNode)(oldType)) {
        return (0, utils_js_1.isListTypeNode)(newType) && safeChangeForFieldType(oldType.type, newType.type) || (0, utils_js_1.isNonNullTypeNode)(newType) && safeChangeForFieldType(oldType, newType['type']);
    }
    return false;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/input-type.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeInputType = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const fields_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/fields.js [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
function mergeInputType(node, existingNode, config, directives) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'InputObjectTypeDefinition' || existingNode.kind === 'InputObjectTypeDefinition' ? 'InputObjectTypeDefinition' : 'InputObjectTypeExtension',
                loc: node.loc,
                fields: (0, fields_js_1.mergeFields)(node, node.fields, existingNode.fields, config),
                directives: (0, directives_js_1.mergeDirectives)(node.directives, existingNode.directives, config, directives)
            };
        } catch (e) {
            throw new Error(`Unable to merge GraphQL input type "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION
    } : node;
}
exports.mergeInputType = mergeInputType;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeNamedTypeArray = void 0;
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
function alreadyExists(arr, other) {
    return !!arr.find((i)=>i.name.value === other.name.value);
}
function mergeNamedTypeArray(first = [], second = [], config = {}) {
    const result = [
        ...second,
        ...first.filter((d)=>!alreadyExists(second, d))
    ];
    if (config && config.sort) {
        result.sort(utils_1.compareNodes);
    }
    return result;
}
exports.mergeNamedTypeArray = mergeNamedTypeArray;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/interface.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeInterface = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const fields_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/fields.js [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const merge_named_type_array_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)");
function mergeInterface(node, existingNode, config, directives) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'InterfaceTypeDefinition' || existingNode.kind === 'InterfaceTypeDefinition' ? 'InterfaceTypeDefinition' : 'InterfaceTypeExtension',
                loc: node.loc,
                fields: (0, fields_js_1.mergeFields)(node, node.fields, existingNode.fields, config),
                directives: (0, directives_js_1.mergeDirectives)(node.directives, existingNode.directives, config, directives),
                interfaces: node['interfaces'] ? (0, merge_named_type_array_js_1.mergeNamedTypeArray)(node['interfaces'], existingNode['interfaces'], config) : undefined
            };
        } catch (e) {
            throw new Error(`Unable to merge GraphQL interface "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: graphql_1.Kind.INTERFACE_TYPE_DEFINITION
    } : node;
}
exports.mergeInterface = mergeInterface;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/type.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeType = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const fields_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/fields.js [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const merge_named_type_array_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)");
function mergeType(node, existingNode, config, directives) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'ObjectTypeDefinition' || existingNode.kind === 'ObjectTypeDefinition' ? 'ObjectTypeDefinition' : 'ObjectTypeExtension',
                loc: node.loc,
                fields: (0, fields_js_1.mergeFields)(node, node.fields, existingNode.fields, config),
                directives: (0, directives_js_1.mergeDirectives)(node.directives, existingNode.directives, config, directives),
                interfaces: (0, merge_named_type_array_js_1.mergeNamedTypeArray)(node.interfaces, existingNode.interfaces, config)
            };
        } catch (e) {
            throw new Error(`Unable to merge GraphQL type "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: graphql_1.Kind.OBJECT_TYPE_DEFINITION
    } : node;
}
exports.mergeType = mergeType;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/scalar.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeScalar = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
function mergeScalar(node, existingNode, config, directives) {
    if (existingNode) {
        return {
            name: node.name,
            description: node['description'] || existingNode['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'ScalarTypeDefinition' || existingNode.kind === 'ScalarTypeDefinition' ? 'ScalarTypeDefinition' : 'ScalarTypeExtension',
            loc: node.loc,
            directives: (0, directives_js_1.mergeDirectives)(node.directives, existingNode.directives, config, directives)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: graphql_1.Kind.SCALAR_TYPE_DEFINITION
    } : node;
}
exports.mergeScalar = mergeScalar;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/union.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeUnion = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const merge_named_type_array_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)");
function mergeUnion(first, second, config, directives) {
    if (second) {
        return {
            name: first.name,
            description: first['description'] || second['description'],
            // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
            directives: (0, directives_js_1.mergeDirectives)(first.directives, second.directives, config, directives),
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || first.kind === 'UnionTypeDefinition' || second.kind === 'UnionTypeDefinition' ? graphql_1.Kind.UNION_TYPE_DEFINITION : graphql_1.Kind.UNION_TYPE_EXTENSION,
            loc: first.loc,
            types: (0, merge_named_type_array_js_1.mergeNamedTypeArray)(first.types, second.types, config)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...first,
        kind: graphql_1.Kind.UNION_TYPE_DEFINITION
    } : first;
}
exports.mergeUnion = mergeUnion;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/schema-def.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeSchemaDefs = exports.DEFAULT_OPERATION_TYPE_NAME_MAP = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
exports.DEFAULT_OPERATION_TYPE_NAME_MAP = {
    query: 'Query',
    mutation: 'Mutation',
    subscription: 'Subscription'
};
function mergeOperationTypes(opNodeList = [], existingOpNodeList = []) {
    const finalOpNodeList = [];
    for(const opNodeType in exports.DEFAULT_OPERATION_TYPE_NAME_MAP){
        const opNode = opNodeList.find((n)=>n.operation === opNodeType) || existingOpNodeList.find((n)=>n.operation === opNodeType);
        if (opNode) {
            finalOpNodeList.push(opNode);
        }
    }
    return finalOpNodeList;
}
function mergeSchemaDefs(node, existingNode, config, directives) {
    if (existingNode) {
        return {
            kind: node.kind === graphql_1.Kind.SCHEMA_DEFINITION || existingNode.kind === graphql_1.Kind.SCHEMA_DEFINITION ? graphql_1.Kind.SCHEMA_DEFINITION : graphql_1.Kind.SCHEMA_EXTENSION,
            description: node['description'] || existingNode['description'],
            directives: (0, directives_js_1.mergeDirectives)(node.directives, existingNode.directives, config, directives),
            operationTypes: mergeOperationTypes(node.operationTypes, existingNode.operationTypes)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: graphql_1.Kind.SCHEMA_DEFINITION
    } : node;
}
exports.mergeSchemaDefs = mergeSchemaDefs;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-nodes.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeGraphQLNodes = exports.isNamedDefinitionNode = exports.schemaDefSymbol = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const type_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/type.js [app-route] (ecmascript)");
const enum_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/enum.js [app-route] (ecmascript)");
const scalar_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/scalar.js [app-route] (ecmascript)");
const union_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/union.js [app-route] (ecmascript)");
const input_type_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/input-type.js [app-route] (ecmascript)");
const interface_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/interface.js [app-route] (ecmascript)");
const directives_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)");
const schema_def_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/schema-def.js [app-route] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
exports.schemaDefSymbol = 'SCHEMA_DEF_SYMBOL';
function isNamedDefinitionNode(definitionNode) {
    return 'name' in definitionNode;
}
exports.isNamedDefinitionNode = isNamedDefinitionNode;
function mergeGraphQLNodes(nodes, config, directives = {}) {
    var _a, _b, _c;
    const mergedResultMap = directives;
    for (const nodeDefinition of nodes){
        if (isNamedDefinitionNode(nodeDefinition)) {
            const name = (_a = nodeDefinition.name) === null || _a === void 0 ? void 0 : _a.value;
            if (config === null || config === void 0 ? void 0 : config.commentDescriptions) {
                (0, utils_1.collectComment)(nodeDefinition);
            }
            if (name == null) {
                continue;
            }
            if (((_b = config === null || config === void 0 ? void 0 : config.exclusions) === null || _b === void 0 ? void 0 : _b.includes(name + '.*')) || ((_c = config === null || config === void 0 ? void 0 : config.exclusions) === null || _c === void 0 ? void 0 : _c.includes(name))) {
                delete mergedResultMap[name];
            } else {
                switch(nodeDefinition.kind){
                    case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
                    case graphql_1.Kind.OBJECT_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, type_js_1.mergeType)(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case graphql_1.Kind.ENUM_TYPE_DEFINITION:
                    case graphql_1.Kind.ENUM_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, enum_js_1.mergeEnum)(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case graphql_1.Kind.UNION_TYPE_DEFINITION:
                    case graphql_1.Kind.UNION_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, union_js_1.mergeUnion)(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
                    case graphql_1.Kind.SCALAR_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, scalar_js_1.mergeScalar)(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
                    case graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, input_type_js_1.mergeInputType)(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
                    case graphql_1.Kind.INTERFACE_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, interface_js_1.mergeInterface)(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case graphql_1.Kind.DIRECTIVE_DEFINITION:
                        mergedResultMap[name] = (0, directives_js_1.mergeDirective)(nodeDefinition, mergedResultMap[name]);
                        break;
                }
            }
        } else if (nodeDefinition.kind === graphql_1.Kind.SCHEMA_DEFINITION || nodeDefinition.kind === graphql_1.Kind.SCHEMA_EXTENSION) {
            mergedResultMap[exports.schemaDefSymbol] = (0, schema_def_js_1.mergeSchemaDefs)(nodeDefinition, mergedResultMap[exports.schemaDefSymbol], config);
        }
    }
    return mergedResultMap;
}
exports.mergeGraphQLNodes = mergeGraphQLNodes;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-typedefs.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeGraphQLTypes = exports.mergeTypeDefs = void 0;
const graphql_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/index.mjs [app-route] (ecmascript)");
const utils_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/utils.js [app-route] (ecmascript)");
const merge_nodes_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-nodes.js [app-route] (ecmascript)");
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
const schema_def_js_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/schema-def.js [app-route] (ecmascript)");
function mergeTypeDefs(typeSource, config) {
    (0, utils_1.resetComments)();
    const doc = {
        kind: graphql_1.Kind.DOCUMENT,
        definitions: mergeGraphQLTypes(typeSource, {
            useSchemaDefinition: true,
            forceSchemaDefinition: false,
            throwOnConflict: false,
            commentDescriptions: false,
            ...config
        })
    };
    let result;
    if (config === null || config === void 0 ? void 0 : config.commentDescriptions) {
        result = (0, utils_1.printWithComments)(doc);
    } else {
        result = doc;
    }
    (0, utils_1.resetComments)();
    return result;
}
exports.mergeTypeDefs = mergeTypeDefs;
function visitTypeSources(typeSource, options, allDirectives = [], allNodes = [], visitedTypeSources = new Set()) {
    if (typeSource && !visitedTypeSources.has(typeSource)) {
        visitedTypeSources.add(typeSource);
        if (typeof typeSource === 'function') {
            visitTypeSources(typeSource(), options, allDirectives, allNodes, visitedTypeSources);
        } else if (Array.isArray(typeSource)) {
            for (const type of typeSource){
                visitTypeSources(type, options, allDirectives, allNodes, visitedTypeSources);
            }
        } else if ((0, graphql_1.isSchema)(typeSource)) {
            const documentNode = (0, utils_1.getDocumentNodeFromSchema)(typeSource, options);
            visitTypeSources(documentNode.definitions, options, allDirectives, allNodes, visitedTypeSources);
        } else if ((0, utils_js_1.isStringTypes)(typeSource) || (0, utils_js_1.isSourceTypes)(typeSource)) {
            const documentNode = (0, graphql_1.parse)(typeSource, options);
            visitTypeSources(documentNode.definitions, options, allDirectives, allNodes, visitedTypeSources);
        } else if (typeof typeSource === 'object' && (0, graphql_1.isDefinitionNode)(typeSource)) {
            if (typeSource.kind === graphql_1.Kind.DIRECTIVE_DEFINITION) {
                allDirectives.push(typeSource);
            } else {
                allNodes.push(typeSource);
            }
        } else if ((0, utils_1.isDocumentNode)(typeSource)) {
            visitTypeSources(typeSource.definitions, options, allDirectives, allNodes, visitedTypeSources);
        } else {
            throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof typeSource}`);
        }
    }
    return {
        allDirectives,
        allNodes
    };
}
function mergeGraphQLTypes(typeSource, config) {
    var _a, _b, _c;
    (0, utils_1.resetComments)();
    const { allDirectives, allNodes } = visitTypeSources(typeSource, config);
    const mergedDirectives = (0, merge_nodes_js_1.mergeGraphQLNodes)(allDirectives, config);
    const mergedNodes = (0, merge_nodes_js_1.mergeGraphQLNodes)(allNodes, config, mergedDirectives);
    if (config === null || config === void 0 ? void 0 : config.useSchemaDefinition) {
        // XXX: right now we don't handle multiple schema definitions
        const schemaDef = mergedNodes[merge_nodes_js_1.schemaDefSymbol] || {
            kind: graphql_1.Kind.SCHEMA_DEFINITION,
            operationTypes: []
        };
        const operationTypes = schemaDef.operationTypes;
        for(const opTypeDefNodeType in schema_def_js_1.DEFAULT_OPERATION_TYPE_NAME_MAP){
            const opTypeDefNode = operationTypes.find((operationType)=>operationType.operation === opTypeDefNodeType);
            if (!opTypeDefNode) {
                const possibleRootTypeName = schema_def_js_1.DEFAULT_OPERATION_TYPE_NAME_MAP[opTypeDefNodeType];
                const existingPossibleRootType = mergedNodes[possibleRootTypeName];
                if (existingPossibleRootType != null && existingPossibleRootType.name != null) {
                    operationTypes.push({
                        kind: graphql_1.Kind.OPERATION_TYPE_DEFINITION,
                        type: {
                            kind: graphql_1.Kind.NAMED_TYPE,
                            name: existingPossibleRootType.name
                        },
                        operation: opTypeDefNodeType
                    });
                }
            }
        }
        if (((_a = schemaDef === null || schemaDef === void 0 ? void 0 : schemaDef.operationTypes) === null || _a === void 0 ? void 0 : _a.length) != null && schemaDef.operationTypes.length > 0) {
            mergedNodes[merge_nodes_js_1.schemaDefSymbol] = schemaDef;
        }
    }
    if ((config === null || config === void 0 ? void 0 : config.forceSchemaDefinition) && !((_c = (_b = mergedNodes[merge_nodes_js_1.schemaDefSymbol]) === null || _b === void 0 ? void 0 : _b.operationTypes) === null || _c === void 0 ? void 0 : _c.length)) {
        mergedNodes[merge_nodes_js_1.schemaDefSymbol] = {
            kind: graphql_1.Kind.SCHEMA_DEFINITION,
            operationTypes: [
                {
                    kind: graphql_1.Kind.OPERATION_TYPE_DEFINITION,
                    operation: 'query',
                    type: {
                        kind: graphql_1.Kind.NAMED_TYPE,
                        name: {
                            kind: graphql_1.Kind.NAME,
                            value: 'Query'
                        }
                    }
                }
            ]
        };
    }
    const mergedNodeDefinitions = Object.values(mergedNodes);
    if (config === null || config === void 0 ? void 0 : config.sort) {
        const sortFn = typeof config.sort === 'function' ? config.sort : utils_js_1.defaultStringComparator;
        mergedNodeDefinitions.sort((a, b)=>{
            var _a, _b;
            return sortFn((_a = a.name) === null || _a === void 0 ? void 0 : _a.value, (_b = b.name) === null || _b === void 0 ? void 0 : _b.value);
        });
    }
    return mergedNodeDefinitions;
}
exports.mergeGraphQLTypes = mergeGraphQLTypes;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/index.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const tslib_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-route] (ecmascript)");
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/arguments.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/directives.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/enum-values.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/enum.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/fields.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/input-type.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/interface.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-nodes.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/merge-typedefs.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/scalar.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/type.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/union.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/utils.js [app-route] (ecmascript)"), exports);
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/extensions.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.applyExtensions = exports.mergeExtensions = exports.extractExtensionsFromSchema = void 0;
const utils_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
var utils_2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/cjs/index.js [app-route] (ecmascript)");
Object.defineProperty(exports, "extractExtensionsFromSchema", {
    enumerable: true,
    get: function() {
        return utils_2.extractExtensionsFromSchema;
    }
});
function mergeExtensions(extensions) {
    return (0, utils_1.mergeDeep)(extensions);
}
exports.mergeExtensions = mergeExtensions;
function applyExtensionObject(obj, extensions) {
    if (!obj) {
        return;
    }
    obj.extensions = (0, utils_1.mergeDeep)([
        obj.extensions || {},
        extensions || {}
    ]);
}
function applyExtensions(schema, extensions) {
    applyExtensionObject(schema, extensions.schemaExtensions);
    for (const [typeName, data] of Object.entries(extensions.types || {})){
        const type = schema.getType(typeName);
        if (type) {
            applyExtensionObject(type, data.extensions);
            if (data.type === 'object' || data.type === 'interface') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)){
                    const field = type.getFields()[fieldName];
                    if (field) {
                        applyExtensionObject(field, fieldData.extensions);
                        for (const [arg, argData] of Object.entries(fieldData.arguments)){
                            applyExtensionObject(field.args.find((a)=>a.name === arg), argData);
                        }
                    }
                }
            } else if (data.type === 'input') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)){
                    const field = type.getFields()[fieldName];
                    applyExtensionObject(field, fieldData.extensions);
                }
            } else if (data.type === 'enum') {
                for (const [valueName, valueData] of Object.entries(data.values)){
                    const value = type.getValue(valueName);
                    applyExtensionObject(value, valueData);
                }
            }
        }
    }
    return schema;
}
exports.applyExtensions = applyExtensions;
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/index.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const tslib_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-route] (ecmascript)");
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/merge-resolvers.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/typedefs-mergers/index.js [app-route] (ecmascript)"), exports);
tslib_1.__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/cjs/extensions.js [app-route] (ecmascript)"), exports);
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/extensions.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "applyExtensions": (()=>applyExtensions),
    "mergeExtensions": (()=>mergeExtensions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$mergeDeep$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/mergeDeep.js [app-route] (ecmascript)");
;
;
function mergeExtensions(extensions) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$mergeDeep$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDeep"])(extensions);
}
function applyExtensionObject(obj, extensions) {
    if (!obj) {
        return;
    }
    obj.extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$mergeDeep$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDeep"])([
        obj.extensions || {},
        extensions || {}
    ]);
}
function applyExtensions(schema, extensions) {
    applyExtensionObject(schema, extensions.schemaExtensions);
    for (const [typeName, data] of Object.entries(extensions.types || {})){
        const type = schema.getType(typeName);
        if (type) {
            applyExtensionObject(type, data.extensions);
            if (data.type === 'object' || data.type === 'interface') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)){
                    const field = type.getFields()[fieldName];
                    if (field) {
                        applyExtensionObject(field, fieldData.extensions);
                        for (const [arg, argData] of Object.entries(fieldData.arguments)){
                            applyExtensionObject(field.args.find((a)=>a.name === arg), argData);
                        }
                    }
                }
            } else if (data.type === 'input') {
                for (const [fieldName, fieldData] of Object.entries(data.fields)){
                    const field = type.getFields()[fieldName];
                    applyExtensionObject(field, fieldData.extensions);
                }
            } else if (data.type === 'enum') {
                for (const [valueName, valueData] of Object.entries(data.values)){
                    const value = type.getValue(valueName);
                    applyExtensionObject(value, valueData);
                }
            }
        }
    }
    return schema;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/merge-resolvers.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeResolvers": (()=>mergeResolvers)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$mergeDeep$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/mergeDeep.js [app-route] (ecmascript)");
;
function mergeResolvers(resolversDefinitions, options) {
    if (!resolversDefinitions || Array.isArray(resolversDefinitions) && resolversDefinitions.length === 0) {
        return {};
    }
    if (!Array.isArray(resolversDefinitions)) {
        return resolversDefinitions;
    }
    if (resolversDefinitions.length === 1) {
        return resolversDefinitions[0] || {};
    }
    const resolvers = new Array();
    for (let resolversDefinition of resolversDefinitions){
        if (Array.isArray(resolversDefinition)) {
            resolversDefinition = mergeResolvers(resolversDefinition);
        }
        if (typeof resolversDefinition === 'object' && resolversDefinition) {
            resolvers.push(resolversDefinition);
        }
    }
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$mergeDeep$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDeep"])(resolvers, true);
    if (options === null || options === void 0 ? void 0 : options.exclusions) {
        for (const exclusion of options.exclusions){
            const [typeName, fieldName] = exclusion.split('.');
            if (!fieldName || fieldName === '*') {
                delete result[typeName];
            } else if (result[typeName]) {
                delete result[typeName][fieldName];
            }
        }
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/utils.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CompareVal": (()=>CompareVal),
    "defaultStringComparator": (()=>defaultStringComparator),
    "extractType": (()=>extractType),
    "isListTypeNode": (()=>isListTypeNode),
    "isNonNullTypeNode": (()=>isNonNullTypeNode),
    "isSourceTypes": (()=>isSourceTypes),
    "isStringTypes": (()=>isStringTypes),
    "isWrappingTypeNode": (()=>isWrappingTypeNode),
    "printTypeNode": (()=>printTypeNode)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/source.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
;
function isStringTypes(types) {
    return typeof types === 'string';
}
function isSourceTypes(types) {
    return types instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$source$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Source"];
}
function extractType(type) {
    let visitedType = type;
    while(visitedType.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].LIST_TYPE || visitedType.kind === 'NonNullType'){
        visitedType = visitedType.type;
    }
    return visitedType;
}
function isWrappingTypeNode(type) {
    return type.kind !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].NAMED_TYPE;
}
function isListTypeNode(type) {
    return type.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].LIST_TYPE;
}
function isNonNullTypeNode(type) {
    return type.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].NON_NULL_TYPE;
}
function printTypeNode(type) {
    if (isListTypeNode(type)) {
        return `[${printTypeNode(type.type)}]`;
    }
    if (isNonNullTypeNode(type)) {
        return `${printTypeNode(type.type)}!`;
    }
    return type.name.value;
}
var CompareVal;
(function(CompareVal) {
    CompareVal[CompareVal["A_SMALLER_THAN_B"] = -1] = "A_SMALLER_THAN_B";
    CompareVal[CompareVal["A_EQUALS_B"] = 0] = "A_EQUALS_B";
    CompareVal[CompareVal["A_GREATER_THAN_B"] = 1] = "A_GREATER_THAN_B";
})(CompareVal || (CompareVal = {}));
function defaultStringComparator(a, b) {
    if (a == null && b == null) {
        return CompareVal.A_EQUALS_B;
    }
    if (a == null) {
        return CompareVal.A_SMALLER_THAN_B;
    }
    if (b == null) {
        return CompareVal.A_GREATER_THAN_B;
    }
    if (a < b) return CompareVal.A_SMALLER_THAN_B;
    if (a > b) return CompareVal.A_GREATER_THAN_B;
    return CompareVal.A_EQUALS_B;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeDirective": (()=>mergeDirective),
    "mergeDirectives": (()=>mergeDirectives)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/printer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/helpers.js [app-route] (ecmascript)");
;
;
function directiveAlreadyExists(directivesArr, otherDirective) {
    return !!directivesArr.find((directive)=>directive.name.value === otherDirective.name.value);
}
function isRepeatableDirective(directive, directives) {
    var _a;
    return !!((_a = directives === null || directives === void 0 ? void 0 : directives[directive.name.value]) === null || _a === void 0 ? void 0 : _a.repeatable);
}
function nameAlreadyExists(name, namesArr) {
    return namesArr.some(({ value })=>value === name.value);
}
function mergeArguments(a1, a2) {
    const result = [
        ...a2
    ];
    for (const argument of a1){
        const existingIndex = result.findIndex((a)=>a.name.value === argument.name.value);
        if (existingIndex > -1) {
            const existingArg = result[existingIndex];
            if (existingArg.value.kind === 'ListValue') {
                const source = existingArg.value.values;
                const target = argument.value.values;
                // merge values of two lists
                existingArg.value.values = deduplicateLists(source, target, (targetVal, source)=>{
                    const value = targetVal.value;
                    return !value || !source.some((sourceVal)=>sourceVal.value === value);
                });
            } else {
                existingArg.value = argument.value;
            }
        } else {
            result.push(argument);
        }
    }
    return result;
}
function deduplicateDirectives(directives, definitions) {
    return directives.map((directive, i, all)=>{
        const firstAt = all.findIndex((d)=>d.name.value === directive.name.value);
        if (firstAt !== i && !isRepeatableDirective(directive, definitions)) {
            const dup = all[firstAt];
            directive.arguments = mergeArguments(directive.arguments, dup.arguments);
            return null;
        }
        return directive;
    }).filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSome"]);
}
function mergeDirectives(d1 = [], d2 = [], config, directives) {
    const reverseOrder = config && config.reverseDirectives;
    const asNext = reverseOrder ? d1 : d2;
    const asFirst = reverseOrder ? d2 : d1;
    const result = deduplicateDirectives([
        ...asNext
    ], directives);
    for (const directive of asFirst){
        if (directiveAlreadyExists(result, directive) && !isRepeatableDirective(directive, directives)) {
            const existingDirectiveIndex = result.findIndex((d)=>d.name.value === directive.name.value);
            const existingDirective = result[existingDirectiveIndex];
            result[existingDirectiveIndex].arguments = mergeArguments(directive.arguments || [], existingDirective.arguments || []);
        } else {
            result.push(directive);
        }
    }
    return result;
}
function validateInputs(node, existingNode) {
    const printedNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["print"])({
        ...node,
        description: undefined
    });
    const printedExistingNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$printer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["print"])({
        ...existingNode,
        description: undefined
    });
    // eslint-disable-next-line
    const leaveInputs = new RegExp('(directive @w*d*)|( on .*$)', 'g');
    const sameArguments = printedNode.replace(leaveInputs, '') === printedExistingNode.replace(leaveInputs, '');
    if (!sameArguments) {
        throw new Error(`Unable to merge GraphQL directive "${node.name.value}". \nExisting directive:  \n\t${printedExistingNode} \nReceived directive: \n\t${printedNode}`);
    }
}
function mergeDirective(node, existingNode) {
    if (existingNode) {
        validateInputs(node, existingNode);
        return {
            ...node,
            locations: [
                ...existingNode.locations,
                ...node.locations.filter((name)=>!nameAlreadyExists(name, existingNode.locations))
            ]
        };
    }
    return node;
}
function deduplicateLists(source, target, filterFn) {
    return source.concat(target.filter((val)=>filterFn(val, source)));
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/arguments.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeArguments": (()=>mergeArguments)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/helpers.js [app-route] (ecmascript)");
;
function mergeArguments(args1, args2, config) {
    const result = deduplicateArguments([
        ...args2,
        ...args1
    ].filter(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSome"]), config);
    if (config && config.sort) {
        result.sort(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareNodes"]);
    }
    return result;
}
function deduplicateArguments(args, config) {
    return args.reduce((acc, current)=>{
        const dupIndex = acc.findIndex((arg)=>arg.name.value === current.name.value);
        if (dupIndex === -1) {
            return acc.concat([
                current
            ]);
        } else if (!(config === null || config === void 0 ? void 0 : config.reverseArguments)) {
            acc[dupIndex] = current;
        }
        return acc;
    }, []);
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeFields": (()=>mergeFields)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/helpers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$arguments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/arguments.js [app-route] (ecmascript)");
;
;
;
;
function fieldAlreadyExists(fieldsArr, otherField) {
    const resultIndex = fieldsArr.findIndex((field)=>field.name.value === otherField.name.value);
    return [
        resultIndex > -1 ? fieldsArr[resultIndex] : null,
        resultIndex
    ];
}
function mergeFields(type, f1, f2, config, directives) {
    const result = [];
    if (f2 != null) {
        result.push(...f2);
    }
    if (f1 != null) {
        for (const field of f1){
            const [existing, existingIndex] = fieldAlreadyExists(result, field);
            if (existing && !(config === null || config === void 0 ? void 0 : config.ignoreFieldConflicts)) {
                const newField = (config === null || config === void 0 ? void 0 : config.onFieldTypeConflict) && config.onFieldTypeConflict(existing, field, type, config === null || config === void 0 ? void 0 : config.throwOnConflict) || preventConflicts(type, existing, field, config === null || config === void 0 ? void 0 : config.throwOnConflict);
                newField.arguments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$arguments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeArguments"])(field['arguments'] || [], existing['arguments'] || [], config);
                newField.directives = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(field.directives, existing.directives, config, directives);
                newField.description = field.description || existing.description;
                result[existingIndex] = newField;
            } else {
                result.push(field);
            }
        }
    }
    if (config && config.sort) {
        result.sort(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareNodes"]);
    }
    if (config && config.exclusions) {
        const exclusions = config.exclusions;
        return result.filter((field)=>!exclusions.includes(`${type.name.value}.${field.name.value}`));
    }
    return result;
}
function preventConflicts(type, a, b, ignoreNullability = false) {
    const aType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["printTypeNode"])(a.type);
    const bType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["printTypeNode"])(b.type);
    if (aType !== bType) {
        const t1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractType"])(a.type);
        const t2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractType"])(b.type);
        if (t1.name.value !== t2.name.value) {
            throw new Error(`Field "${b.name.value}" already defined with a different type. Declared as "${t1.name.value}", but you tried to override with "${t2.name.value}"`);
        }
        if (!safeChangeForFieldType(a.type, b.type, !ignoreNullability)) {
            throw new Error(`Field '${type.name.value}.${a.name.value}' changed type from '${aType}' to '${bType}'`);
        }
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNullTypeNode"])(b.type) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNullTypeNode"])(a.type)) {
        a.type = b.type;
    }
    return a;
}
function safeChangeForFieldType(oldType, newType, ignoreNullability = false) {
    // both are named
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isWrappingTypeNode"])(oldType) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isWrappingTypeNode"])(newType)) {
        return oldType.toString() === newType.toString();
    }
    // new is non-null
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNullTypeNode"])(newType)) {
        const ofType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNullTypeNode"])(oldType) ? oldType.type : oldType;
        return safeChangeForFieldType(ofType, newType.type);
    }
    // old is non-null
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNullTypeNode"])(oldType)) {
        return safeChangeForFieldType(newType, oldType, ignoreNullability);
    }
    // old is list
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isListTypeNode"])(oldType)) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isListTypeNode"])(newType) && safeChangeForFieldType(oldType.type, newType.type) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNullTypeNode"])(newType) && safeChangeForFieldType(oldType, newType['type']);
    }
    return false;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeNamedTypeArray": (()=>mergeNamedTypeArray)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/helpers.js [app-route] (ecmascript)");
;
function alreadyExists(arr, other) {
    return !!arr.find((i)=>i.name.value === other.name.value);
}
function mergeNamedTypeArray(first = [], second = [], config = {}) {
    const result = [
        ...second,
        ...first.filter((d)=>!alreadyExists(second, d))
    ];
    if (config && config.sort) {
        result.sort(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareNodes"]);
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/type.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeType": (()=>mergeType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$fields$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$named$2d$type$2d$array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)");
;
;
;
;
function mergeType(node, existingNode, config, directives) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'ObjectTypeDefinition' || existingNode.kind === 'ObjectTypeDefinition' ? 'ObjectTypeDefinition' : 'ObjectTypeExtension',
                loc: node.loc,
                fields: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$fields$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeFields"])(node, node.fields, existingNode.fields, config),
                directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(node.directives, existingNode.directives, config, directives),
                interfaces: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$named$2d$type$2d$array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeNamedTypeArray"])(node.interfaces, existingNode.interfaces, config)
            };
        } catch (e) {
            throw new Error(`Unable to merge GraphQL type "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_DEFINITION
    } : node;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum-values.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeEnumValues": (()=>mergeEnumValues)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/helpers.js [app-route] (ecmascript)");
;
;
function mergeEnumValues(first, second, config, directives) {
    if (config === null || config === void 0 ? void 0 : config.consistentEnumMerge) {
        const reversed = [];
        if (first) {
            reversed.push(...first);
        }
        first = second;
        second = reversed;
    }
    const enumValueMap = new Map();
    if (first) {
        for (const firstValue of first){
            enumValueMap.set(firstValue.name.value, firstValue);
        }
    }
    if (second) {
        for (const secondValue of second){
            const enumValue = secondValue.name.value;
            if (enumValueMap.has(enumValue)) {
                const firstValue = enumValueMap.get(enumValue);
                firstValue.description = secondValue.description || firstValue.description;
                firstValue.directives = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(secondValue.directives, firstValue.directives, directives);
            } else {
                enumValueMap.set(enumValue, secondValue);
            }
        }
    }
    const result = [
        ...enumValueMap.values()
    ];
    if (config && config.sort) {
        result.sort(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$helpers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareNodes"]);
    }
    return result;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeEnum": (()=>mergeEnum)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$enum$2d$values$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum-values.js [app-route] (ecmascript)");
;
;
;
function mergeEnum(e1, e2, config, directives) {
    if (e2) {
        return {
            name: e1.name,
            description: e1['description'] || e2['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || e1.kind === 'EnumTypeDefinition' || e2.kind === 'EnumTypeDefinition' ? 'EnumTypeDefinition' : 'EnumTypeExtension',
            loc: e1.loc,
            directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(e1.directives, e2.directives, config, directives),
            values: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$enum$2d$values$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeEnumValues"])(e1.values, e2.values, config)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...e1,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_DEFINITION
    } : e1;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/scalar.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeScalar": (()=>mergeScalar)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
;
;
function mergeScalar(node, existingNode, config, directives) {
    if (existingNode) {
        return {
            name: node.name,
            description: node['description'] || existingNode['description'],
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'ScalarTypeDefinition' || existingNode.kind === 'ScalarTypeDefinition' ? 'ScalarTypeDefinition' : 'ScalarTypeExtension',
            loc: node.loc,
            directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(node.directives, existingNode.directives, config, directives)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_DEFINITION
    } : node;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/union.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeUnion": (()=>mergeUnion)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$named$2d$type$2d$array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)");
;
;
;
function mergeUnion(first, second, config, directives) {
    if (second) {
        return {
            name: first.name,
            description: first['description'] || second['description'],
            // ConstXNode has been introduced in v16 but it is not compatible with XNode so we do `as any` for backwards compatibility
            directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(first.directives, second.directives, config, directives),
            kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || first.kind === 'UnionTypeDefinition' || second.kind === 'UnionTypeDefinition' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_DEFINITION : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_EXTENSION,
            loc: first.loc,
            types: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$named$2d$type$2d$array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeNamedTypeArray"])(first.types, second.types, config)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...first,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_DEFINITION
    } : first;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/input-type.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeInputType": (()=>mergeInputType)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$fields$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
;
;
;
function mergeInputType(node, existingNode, config, directives) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'InputObjectTypeDefinition' || existingNode.kind === 'InputObjectTypeDefinition' ? 'InputObjectTypeDefinition' : 'InputObjectTypeExtension',
                loc: node.loc,
                fields: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$fields$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeFields"])(node, node.fields, existingNode.fields, config),
                directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(node.directives, existingNode.directives, config, directives)
            };
        } catch (e) {
            throw new Error(`Unable to merge GraphQL input type "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_DEFINITION
    } : node;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/interface.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeInterface": (()=>mergeInterface)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$fields$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/fields.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$named$2d$type$2d$array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-named-type-array.js [app-route] (ecmascript)");
;
;
;
;
function mergeInterface(node, existingNode, config, directives) {
    if (existingNode) {
        try {
            return {
                name: node.name,
                description: node['description'] || existingNode['description'],
                kind: (config === null || config === void 0 ? void 0 : config.convertExtensions) || node.kind === 'InterfaceTypeDefinition' || existingNode.kind === 'InterfaceTypeDefinition' ? 'InterfaceTypeDefinition' : 'InterfaceTypeExtension',
                loc: node.loc,
                fields: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$fields$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeFields"])(node, node.fields, existingNode.fields, config),
                directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(node.directives, existingNode.directives, config, directives),
                interfaces: node['interfaces'] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$named$2d$type$2d$array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeNamedTypeArray"])(node['interfaces'], existingNode['interfaces'], config) : undefined
            };
        } catch (e) {
            throw new Error(`Unable to merge GraphQL interface "${node.name.value}": ${e.message}`);
        }
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_DEFINITION
    } : node;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/schema-def.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DEFAULT_OPERATION_TYPE_NAME_MAP": (()=>DEFAULT_OPERATION_TYPE_NAME_MAP),
    "mergeSchemaDefs": (()=>mergeSchemaDefs)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
;
;
const DEFAULT_OPERATION_TYPE_NAME_MAP = {
    query: 'Query',
    mutation: 'Mutation',
    subscription: 'Subscription'
};
function mergeOperationTypes(opNodeList = [], existingOpNodeList = []) {
    const finalOpNodeList = [];
    for(const opNodeType in DEFAULT_OPERATION_TYPE_NAME_MAP){
        const opNode = opNodeList.find((n)=>n.operation === opNodeType) || existingOpNodeList.find((n)=>n.operation === opNodeType);
        if (opNode) {
            finalOpNodeList.push(opNode);
        }
    }
    return finalOpNodeList;
}
function mergeSchemaDefs(node, existingNode, config, directives) {
    if (existingNode) {
        return {
            kind: node.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION || existingNode.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_EXTENSION,
            description: node['description'] || existingNode['description'],
            directives: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirectives"])(node.directives, existingNode.directives, config, directives),
            operationTypes: mergeOperationTypes(node.operationTypes, existingNode.operationTypes)
        };
    }
    return (config === null || config === void 0 ? void 0 : config.convertExtensions) ? {
        ...node,
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION
    } : node;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-nodes.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "isNamedDefinitionNode": (()=>isNamedDefinitionNode),
    "mergeGraphQLNodes": (()=>mergeGraphQLNodes),
    "schemaDefSymbol": (()=>schemaDefSymbol)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/type.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/enum.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$scalar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/scalar.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$union$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/union.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$input$2d$type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/input-type.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$interface$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/interface.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$schema$2d$def$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/schema-def.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/comments.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const schemaDefSymbol = 'SCHEMA_DEF_SYMBOL';
function isNamedDefinitionNode(definitionNode) {
    return 'name' in definitionNode;
}
function mergeGraphQLNodes(nodes, config, directives = {}) {
    var _a, _b, _c;
    const mergedResultMap = directives;
    for (const nodeDefinition of nodes){
        if (isNamedDefinitionNode(nodeDefinition)) {
            const name = (_a = nodeDefinition.name) === null || _a === void 0 ? void 0 : _a.value;
            if (config === null || config === void 0 ? void 0 : config.commentDescriptions) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["collectComment"])(nodeDefinition);
            }
            if (name == null) {
                continue;
            }
            if (((_b = config === null || config === void 0 ? void 0 : config.exclusions) === null || _b === void 0 ? void 0 : _b.includes(name + '.*')) || ((_c = config === null || config === void 0 ? void 0 : config.exclusions) === null || _c === void 0 ? void 0 : _c.includes(name))) {
                delete mergedResultMap[name];
            } else {
                switch(nodeDefinition.kind){
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_DEFINITION:
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].OBJECT_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeType"])(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_DEFINITION:
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].ENUM_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$enum$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeEnum"])(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_DEFINITION:
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].UNION_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$union$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeUnion"])(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_DEFINITION:
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCALAR_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$scalar$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeScalar"])(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_DEFINITION:
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].INPUT_OBJECT_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$input$2d$type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeInputType"])(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_DEFINITION:
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].INTERFACE_TYPE_EXTENSION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$interface$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeInterface"])(nodeDefinition, mergedResultMap[name], config, directives);
                        break;
                    case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION:
                        mergedResultMap[name] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeDirective"])(nodeDefinition, mergedResultMap[name]);
                        break;
                }
            }
        } else if (nodeDefinition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION || nodeDefinition.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_EXTENSION) {
            mergedResultMap[schemaDefSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$schema$2d$def$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeSchemaDefs"])(nodeDefinition, mergedResultMap[schemaDefSymbol], config);
        }
    }
    return mergedResultMap;
}
}}),
"[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-typedefs.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "mergeGraphQLTypes": (()=>mergeGraphQLTypes),
    "mergeTypeDefs": (()=>mergeTypeDefs)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/parser.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/kinds.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/type/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/graphql@16.11.0/node_modules/graphql/language/predicates.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/merge-nodes.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$print$2d$schema$2d$with$2d$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/print-schema-with-directives.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$isDocumentNode$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/isDocumentNode.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+utils@9.2.1_graphql@16.11.0/node_modules/@graphql-tools/utils/esm/comments.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$schema$2d$def$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@graphql-tools+merge@8.4.2_graphql@16.11.0/node_modules/@graphql-tools/merge/esm/typedefs-mergers/schema-def.js [app-route] (ecmascript)");
;
;
;
;
;
function mergeTypeDefs(typeSource, config) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetComments"])();
    const doc = {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].DOCUMENT,
        definitions: mergeGraphQLTypes(typeSource, {
            useSchemaDefinition: true,
            forceSchemaDefinition: false,
            throwOnConflict: false,
            commentDescriptions: false,
            ...config
        })
    };
    let result;
    if (config === null || config === void 0 ? void 0 : config.commentDescriptions) {
        result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["printWithComments"])(doc);
    } else {
        result = doc;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetComments"])();
    return result;
}
function visitTypeSources(typeSource, options, allDirectives = [], allNodes = [], visitedTypeSources = new Set()) {
    if (typeSource && !visitedTypeSources.has(typeSource)) {
        visitedTypeSources.add(typeSource);
        if (typeof typeSource === 'function') {
            visitTypeSources(typeSource(), options, allDirectives, allNodes, visitedTypeSources);
        } else if (Array.isArray(typeSource)) {
            for (const type of typeSource){
                visitTypeSources(type, options, allDirectives, allNodes, visitedTypeSources);
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$type$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSchema"])(typeSource)) {
            const documentNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$print$2d$schema$2d$with$2d$directives$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDocumentNodeFromSchema"])(typeSource, options);
            visitTypeSources(documentNode.definitions, options, allDirectives, allNodes, visitedTypeSources);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isStringTypes"])(typeSource) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSourceTypes"])(typeSource)) {
            const documentNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$parser$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parse"])(typeSource, options);
            visitTypeSources(documentNode.definitions, options, allDirectives, allNodes, visitedTypeSources);
        } else if (typeof typeSource === 'object' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$predicates$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDefinitionNode"])(typeSource)) {
            if (typeSource.kind === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].DIRECTIVE_DEFINITION) {
                allDirectives.push(typeSource);
            } else {
                allNodes.push(typeSource);
            }
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$isDocumentNode$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDocumentNode"])(typeSource)) {
            visitTypeSources(typeSource.definitions, options, allDirectives, allNodes, visitedTypeSources);
        } else {
            throw new Error(`typeDefs must contain only strings, documents, schemas, or functions, got ${typeof typeSource}`);
        }
    }
    return {
        allDirectives,
        allNodes
    };
}
function mergeGraphQLTypes(typeSource, config) {
    var _a, _b, _c;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$utils$40$9$2e$2$2e$1_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$utils$2f$esm$2f$comments$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetComments"])();
    const { allDirectives, allNodes } = visitTypeSources(typeSource, config);
    const mergedDirectives = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeGraphQLNodes"])(allDirectives, config);
    const mergedNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeGraphQLNodes"])(allNodes, config, mergedDirectives);
    if (config === null || config === void 0 ? void 0 : config.useSchemaDefinition) {
        // XXX: right now we don't handle multiple schema definitions
        const schemaDef = mergedNodes[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaDefSymbol"]] || {
            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION,
            operationTypes: []
        };
        const operationTypes = schemaDef.operationTypes;
        for(const opTypeDefNodeType in __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$schema$2d$def$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_OPERATION_TYPE_NAME_MAP"]){
            const opTypeDefNode = operationTypes.find((operationType)=>operationType.operation === opTypeDefNodeType);
            if (!opTypeDefNode) {
                const possibleRootTypeName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$schema$2d$def$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_OPERATION_TYPE_NAME_MAP"][opTypeDefNodeType];
                const existingPossibleRootType = mergedNodes[possibleRootTypeName];
                if (existingPossibleRootType != null && existingPossibleRootType.name != null) {
                    operationTypes.push({
                        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].OPERATION_TYPE_DEFINITION,
                        type: {
                            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].NAMED_TYPE,
                            name: existingPossibleRootType.name
                        },
                        operation: opTypeDefNodeType
                    });
                }
            }
        }
        if (((_a = schemaDef === null || schemaDef === void 0 ? void 0 : schemaDef.operationTypes) === null || _a === void 0 ? void 0 : _a.length) != null && schemaDef.operationTypes.length > 0) {
            mergedNodes[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaDefSymbol"]] = schemaDef;
        }
    }
    if ((config === null || config === void 0 ? void 0 : config.forceSchemaDefinition) && !((_c = (_b = mergedNodes[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaDefSymbol"]]) === null || _b === void 0 ? void 0 : _b.operationTypes) === null || _c === void 0 ? void 0 : _c.length)) {
        mergedNodes[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$merge$2d$nodes$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaDefSymbol"]] = {
            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].SCHEMA_DEFINITION,
            operationTypes: [
                {
                    kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].OPERATION_TYPE_DEFINITION,
                    operation: 'query',
                    type: {
                        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].NAMED_TYPE,
                        name: {
                            kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$graphql$40$16$2e$11$2e$0$2f$node_modules$2f$graphql$2f$language$2f$kinds$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Kind"].NAME,
                            value: 'Query'
                        }
                    }
                }
            ]
        };
    }
    const mergedNodeDefinitions = Object.values(mergedNodes);
    if (config === null || config === void 0 ? void 0 : config.sort) {
        const sortFn = typeof config.sort === 'function' ? config.sort : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$graphql$2d$tools$2b$merge$40$8$2e$4$2e$2_graphql$40$16$2e$11$2e$0$2f$node_modules$2f40$graphql$2d$tools$2f$merge$2f$esm$2f$typedefs$2d$mergers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultStringComparator"];
        mergedNodeDefinitions.sort((a, b)=>{
            var _a, _b;
            return sortFn((_a = a.name) === null || _a === void 0 ? void 0 : _a.value, (_b = b.name) === null || _b === void 0 ? void 0 : _b.value);
        });
    }
    return mergedNodeDefinitions;
}
}}),

};

//# sourceMappingURL=2c4b4_%40graphql-tools_merge_9c3b6a5c._.js.map