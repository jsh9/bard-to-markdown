## Question

I'm learning Javascript.  Can you summarize the difference between const, var, and let in a table?

## Answer

Sure, here is a table summarizing the differences between `const`, `var`, and `let` in JavaScript:

| Feature | `const` | `var` | `let` |
|---|---|---|---|
| Scope | Block-scoped | Function-scoped | Block-scoped |
| Hoisting | No | Yes | No |
| Reassignment | Not allowed | Allowed | Allowed |
| Initialization | Required | Not required | Not required |

**Scope**

The scope of a variable determines where it can be accessed. `const` and `let` variables are block-scoped, which means they can only be accessed within the block they were declared in. `var` variables are function-scoped, which means they can be accessed within the function they were declared in.

**Hoisting**

Hoisting is the process of moving variable declarations to the top of their scope. `var` variables are hoisted, which means they can be accessed even before they are declared. `const` and `let` variables are not hoisted, which means they cannot be accessed before they are declared.

**Reassignment**

`const` variables cannot be reassigned. `var` and `let` variables can be reassigned.

**Initialization**

`const` variables must be initialized when they are declared. `var` and `let` variables can be initialized or not initialized.

In general, it is recommended to use `const` variables whenever possible. `const` variables make your code more readable and maintainable. `var` variables should only be used when you need to reassign the variable's value. `let` variables are a newer addition to JavaScript and should be used in preference to `var` variables whenever possible.
