import type { RuleTester } from "oxlint/plugins-dev";

type Rule = Parameters<RuleTester["run"]>[1];
type AstNode = Parameters<NonNullable<ReturnType<NonNullable<Rule["create"]>>[string]>>[0];

const functions =
  ":matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction, TSMethodSignature, TSFunctionType, TSCallSignatureDeclaration, TSConstructSignatureDeclaration)";
const parameters =
  ":matches(Identifier, ObjectPattern, ArrayPattern, AssignmentPattern, RestElement)";

const noUnknown: Rule = {
  meta: {
    schema: [],
    messages: {
      contract:
        "Use a precise application type. Decode unknown data in an explicit input-boundary file.",
    },
  },
  create(context) {
    return {
      TSUnknownKeyword(node) {
        if (node.parent?.parent?.parent?.type === "CatchClause") return;

        context.report({ node, messageId: "contract" });
      },
    };
  },
};

const namedContracts: Rule = {
  meta: {
    schema: [],
    messages: { contract: "Use a named type for this function's object parameter or response." },
  },
  create(context) {
    return {
      [`${functions} > ${parameters} > TSTypeAnnotation TSTypeLiteral, ${functions} > TSTypeAnnotation TSTypeLiteral`](
        node,
      ) {
        context.report({ node, messageId: "contract" });
      },
    };
  },
};

const explicitReturn: Rule = {
  meta: { schema: [], messages: { contract: "Declare the exported function's return type." } },
  create(context) {
    return {
      ":matches(ExportNamedDeclaration, ExportDefaultDeclaration) > FunctionDeclaration:not([returnType])"(
        node,
      ) {
        context.report({ node, messageId: "contract" });
      },
    };
  },
};

const namedValues: Rule = {
  meta: {
    schema: [],
    messages: { contract: "Use a named domain constant for this status or role value." },
  },
  create(context) {
    return {
      "Property[key.name=/^(status|role)$/] > Literal.value, Property[key.value=/^(status|role)$/] > Literal.value, AssignmentExpression[left.type=MemberExpression][left.property.name=/^(status|role)$/] > Literal.right, AssignmentExpression[left.type=MemberExpression][left.property.value=/^(status|role)$/] > Literal.right, BinaryExpression[left.type=MemberExpression][left.property.name=/^(status|role)$/] > Literal, BinaryExpression[right.type=MemberExpression][right.property.name=/^(status|role)$/] > Literal, BinaryExpression[left.type=MemberExpression][left.property.value=/^(status|role)$/] > Literal, BinaryExpression[right.type=MemberExpression][right.property.value=/^(status|role)$/] > Literal"(
        node,
      ) {
        if (node.type === "Literal" && typeof node.value === "string") {
          context.report({ node, messageId: "contract" });
        }
      },
      "ReturnStatement > Literal"(node) {
        // The source-code API declares spans; visitors expose the complete AST node type.
        const ancestors = context.sourceCode.getAncestors(node) as AstNode[];
        const owner = ancestors.findLast(
          (ancestor) =>
            ancestor.type === "FunctionDeclaration" ||
            ancestor.type === "FunctionExpression" ||
            ancestor.type === "ArrowFunctionExpression",
        );

        if (!owner || !("returnType" in owner)) return;

        const annotation = owner.returnType?.typeAnnotation;

        if (
          annotation?.type === "TSTypeReference" &&
          annotation.typeName.type === "Identifier" &&
          annotation.typeName.name.endsWith("Status") &&
          node.type === "Literal" &&
          typeof node.value === "string"
        ) {
          context.report({ node, messageId: "contract" });
        }
      },
    };
  },
};

export default {
  meta: { name: "coding-agent" },
  rules: {
    "no-unknown": noUnknown,
    "named-function-contracts": namedContracts,
    "explicit-export-return": explicitReturn,
    "named-domain-values": namedValues,
  },
};
