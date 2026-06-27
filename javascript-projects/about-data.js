export const subjects = [
    {
        id: 'javascript',
        title: 'JavaScript',
        badge: 'ES6+',
        badgeClass: 'badge-js',
        icon: '🟨',
        introduction: 'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It is a core technology of the World Wide Web, alongside HTML and CSS, enabling interactive web pages and is an essential part of web applications. The majority of websites employ JavaScript, and it is supported by all modern web browsers without the need for plugins. JavaScript is a prototype-based, multi-paradigm language that supports event-driven, functional, and imperative programming styles, making it one of the most versatile and widely-used languages in software development today.',
        history: [
            'JavaScript was created in just 10 days in May 1995 by Brendan Eich while he was working at Netscape Communications Corporation. Originally named Mocha, it was quickly renamed to LiveScript and finally JavaScript as a marketing move to capitalize on the popularity of Java. The first version appeared in Netscape Navigator 2.0 in December 1995.',
            'In 1996, Netscape submitted JavaScript to Ecma International for standardization, resulting in the ECMAScript standard. The first edition was published in 1997. Over the following years, JavaScript faced fragmentation with competing implementations like Microsoft\'s JScript, leading to the "Browser Wars" era. This prompted the need for standardization and the formation of the TC39 committee.',
            'The mid-2000s saw the rise of AJAX (Asynchronous JavaScript and XML), which revolutionized web development by enabling seamless data exchange between the browser and server without full page reloads. Libraries like jQuery, Prototype, and Dojo emerged to abstract away browser inconsistencies and simplify DOM manipulation. jQuery, in particular, became ubiquitous, at one point powering over 70% of the top million websites.',
            'A landmark moment came in 2009 with the release of Node.js by Ryan Dahl, which brought JavaScript to the server side. Built on Google\'s V8 JavaScript engine, Node.js enabled developers to use JavaScript for building scalable network applications, file system operations, and full-stack development. The same year saw the release of ES5, which added strict mode, JSON support, and improved array methods.',
            'The modern era of JavaScript began with ES6 (also known as ES2015), released in June 2015. This was the most significant update to the language, introducing classes, arrow functions, template literals, destructuring, default parameters, rest/spread operators, Promises, modules (import/export), let/const, Map, Set, Symbol, and iterators. ES6 fundamentally changed how developers write JavaScript, making the code more readable, maintainable, and powerful.',
            'Since ES6, the TC39 committee has adopted a yearly release cadence, bringing new features regularly. ES2016 added the exponentiation operator and Array.prototype.includes. ES2017 introduced async/await for cleaner asynchronous code. ES2018 added rest/spread for objects and asynchronous iteration. ES2019 brought Array.prototype.flat and Object.fromEntries. ES2020 introduced optional chaining, nullish coalescing, and BigInt. ES2021 added String.prototype.replaceAll and Promise.any. ES2022 introduced class fields and the # private syntax. ES2023 brought Array.prototype.findLast and Hashbang support.',
            'Today, JavaScript is everywhere. It powers frontend frameworks like React, Vue, Angular, and Svelte. It runs on servers via Node.js, Deno, and Bun. It builds mobile apps with React Native and NativeScript. It creates desktop apps with Electron and Tauri. It even runs on embedded systems and IoT devices. The npm ecosystem boasts over 2 million packages, making it the largest package registry in the world. JavaScript\'s influence continues to grow, with WebAssembly opening new possibilities for performance-critical applications in the browser.',
        ],
        topics: {
            beginner: [
                { name: 'Variables & Data Types', desc: 'Understanding var, let, const, and working with strings, numbers, booleans, null, undefined, objects, and arrays' },
                { name: 'Functions & Scope', desc: 'Function declarations, expressions, arrow functions, parameters, return values, and lexical scoping' },
                { name: 'DOM Manipulation', desc: 'Selecting elements, modifying content and styles, creating and removing nodes, and traversing the DOM tree' },
                { name: 'Events & Callbacks', desc: 'Event listeners, event propagation, preventing default behavior, and the callback pattern' },
            ],
            intermediate: [
                { name: 'Closures & Hoisting', desc: 'Lexical environment, closure scope chain, practical use cases like memoization and module pattern' },
                { name: 'Prototypes & Inheritance', desc: 'Prototype chain, constructor functions, class syntax, and prototypal vs classical inheritance' },
                { name: 'Promises & Async/Await', desc: 'Promise chaining, error handling, Promise.all/race/allSettled, and async/await syntax' },
                { name: 'Modules & Bundlers', desc: 'ES modules, dynamic imports, tree-shaking, and tools like Webpack, Vite, Rollup, and esbuild' },
            ],
            advanced: [
                { name: 'Event Loop & Microtasks', desc: 'Call stack, task queue, microtask queue, requestAnimationFrame, and understanding concurrency model' },
                { name: 'Generators & Iterators', desc: 'Generator functions, yield expressions, Symbol.iterator, and custom iterables for lazy evaluation' },
                { name: 'Proxies & Reflect', desc: 'Trap handlers, meta-programming, reactive state tracking, and intercepting object operations' },
                { name: 'Web Workers & Parallelism', desc: 'Dedicated workers, shared workers, transferable objects, and offloading CPU-intensive tasks' },
            ],
        },
    },
    {
        id: 'typescript',
        title: 'TypeScript',
        badge: 'Strict',
        badgeClass: 'badge-ts',
        icon: '🔷',
        introduction: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing, classes, interfaces, generics, enums, and other advanced features on top of JavaScript, compiling down to clean, readable JavaScript that runs anywhere JavaScript runs. TypeScript is developed and maintained by Microsoft and has become one of the most popular languages for large-scale application development, catching type errors at compile time and providing superior IDE support with autocompletion, navigation, and refactoring.',
        history: [
            'TypeScript was first publicly announced in October 2012 and was developed by Microsoft under the leadership of Anders Hejlsberg, the lead architect of C# and creator of Turbo Pascal. The initial version, 0.8, was released in November 2012 and supported basic type annotations, classes, and interfaces. The language was designed from the ground up to be a strict superset of JavaScript, meaning any valid JavaScript code is also valid TypeScript code.',
            'The first major milestone was TypeScript 1.0, released in April 2014, which added support for modules, type inference, and generics. This version also introduced the TypeScript compiler (tsc) and language service, providing the foundation for the excellent editor integration that TypeScript is known for today. Microsoft also released TypeScript for Visual Studio 2013 at this time, giving developers a powerful development experience.',
            'TypeScript 2.0, released in September 2016, was a significant update that introduced non-nullable types, control flow analysis, tagged union types, and the readonly modifier. This version also added the `--strictNullChecks` flag, which became one of the most important features for writing safer code. TypeScript 2.1 added keyof and mapped types, while 2.3 added async/await support and 2.4 added dynamic import expressions.',
            'The release of TypeScript 3.0 in July 2018 introduced project references for better build organization and the `unknown` type as a type-safe alternative to `any`. TypeScript 3.7 (November 2019) was a landmark release that added optional chaining, nullish coalescing, and assertion functions. TypeScript 4.0 (August 2020) introduced variadic tuple types and labeled tuple elements, while 4.1 added template literal types.',
            'TypeScript 4.2 (February 2021) improved tuple types and added leading/middle rest elements. TypeScript 4.5 (November 2021) added the `Awaited` type and `import` syntax for type-only imports. TypeScript 5.0 (March 2023) was a major release that introduced decorators, const type parameters, and multiple performance improvements, making the compiler up to 10x faster. It also improved the module resolution strategy.',
            'TypeScript has seen explosive adoption in the developer community. According to the Stack Overflow Developer Survey, TypeScript has consistently ranked among the most loved and wanted languages. Major companies like Google, Airbnb, Slack, and Asana have adopted TypeScript for their large codebases. Angular was built with TypeScript from the start, Next.js has first-class TypeScript support, and React officially recommends TypeScript for new projects. The DefinitelyTyped community provides type definitions for thousands of JavaScript libraries, making TypeScript compatible with virtually any existing JavaScript code.',
            'The future of TypeScript looks bright, with ongoing development focused on improving performance, supporting new ECMAScript features, enhancing type inference, and improving the developer experience. TypeScript has become the standard for building large-scale JavaScript applications, providing the safety and tooling that developers need while maintaining full compatibility with the JavaScript ecosystem.',
        ],
        topics: {
            beginner: [
                { name: 'Basic Types & Annotations', desc: 'Primitive types, arrays, tuples, enums, union/intersection types, and type annotations for variables and parameters' },
                { name: 'Interfaces & Type Aliases', desc: 'Defining object shapes, optional/readonly properties, interface merging, and type aliases vs interfaces' },
                { name: 'Functions & Signatures', desc: 'Parameter types, return types, optional/default parameters, overloads, and callable interfaces' },
                { name: 'Classes & Access Modifiers', desc: 'Class properties, constructor shorthand, public/private/protected, readonly, and parameter properties' },
            ],
            intermediate: [
                { name: 'Generics & Constraints', desc: 'Generic functions and classes, type parameters, constraints with extends, and generic utility types' },
                { name: 'Type Narrowing & Guards', desc: 'typeof, instanceof, discriminated unions, type predicates, and assertion functions for narrowing types' },
                { name: 'Modules & Namespaces', desc: 'ES module syntax, ambient declarations, module augmentation, and the namespace pattern' },
                { name: 'Declaration Files', desc: 'Writing .d.ts files, ambient module declarations, global types, and publishing type definitions' },
            ],
            advanced: [
                { name: 'Conditional & Mapped Types', desc: 'T extends U ? X : Y syntax, infer keyword, key remapping, and transforming object types' },
                { name: 'Template Literal Types', desc: 'String manipulation in type space, intrinsic types (Uppercase, Lowercase, Capitalize), and pattern matching' },
                { name: 'Decorators & Metadata', desc: 'Class, method, accessor, property, and parameter decorators with reflection metadata for cross-cutting concerns' },
                { name: 'Type System Deep Dive', desc: 'Structural vs nominal typing, variance (covariant/contravariant), branding/flavoring, and type-level programming' },
            ],
        },
    },
];

export const topicLabels = {
    beginner: { title: 'Beginner', color: '#10b981', bg: '#d1fae5' },
    intermediate: { title: 'Intermediate', color: '#f59e0b', bg: '#fef3c7' },
    advanced: { title: 'Advanced', color: '#ef4444', bg: '#fee2e2' },
};
