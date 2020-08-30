---
title: The Onyx Programming Language
location: Moscow, Russia
templateEngineOverride: md
excerpt: System programming seems to be much harder than application programming. Why is that and how to overcome this?
cover: /public/img/onyx-logo-white-background.png
ogType: article
---

In the [previous article](/posts/2020-08-16-system-programming-in-2k20) I successfully justified my desire to build yet another system programming language.
Unlike _others_, I want to do it right from the very beginning.
Meet Onyx!

<h2>Table of Contents</h2>

${toc}

## The Onyx programming language

![The language logo, an Onyx-black panther](../../../public/img/onyx-logo.png =60%x)

Onyx is a general-purpose statically typed programming language suitable both for application and system programming.

### Top-Down Features

Onyx syntax is inspired by **C-family** languages, such as Ruby, C++ and even <s>Rust</s> <small>I'm sorry</small>.

Onyx imposes robust **inference** mechanisms.
The rule is generally "infer unless ambiguous", with meaningful defaults.

Onyx is a **memory-safe** language.
There are multiple levels of enforced safety, with `unsafe` being the minimum safety level allowing for extreme optimizations.
This opens great opportunities for powerful abstractions.

Unlike [_other_](https://www.rust-lang.org/){.secret-link} languages, Onyx treats **pointer arithmetic** as a first-class use-case, but with memory safety.
The concept is expressed in raw but typed pointers containing a memory scope.
For example, it is not possible to safely pass a local pointer to an outer scope.
Moreover, pointers preserve low-level features like address spacing and alignment.

It is extremely easy to do **interoperability** in Onyx.
Onyx is similar to C++ in this sense: C code is considered a part of the program (with minor differences), and it is simple to export Onyx code as a shared library.

Programs written in Onyx are **cross-platform** by default in the sense of that there are no target-dependent features in the language itself: no threading, no memory control.
But fear not, thanks to powerful abstractions, these are likely to be already implemented by someone else!

Onyx introduces **powerful macros** written in Lua.
It allows to re-use existing Lua code and have full access to the compilation context thanks to easy debugging with Lua.

Onyx has **<u>[simple-to-understand](https://twitter.com/vladfaust/status/1299116755596566528){.secret-link}</u> lifetime and moving** concepts naturally built into the language.
Instead of fighting with a borrow checker, simply get an address of a variable: a compiler would not allow you to misuse it.

Classes may have a finalizer defined and thus have **automatic resource control**.

Onyx implements real **traits** as [composable units of behaviour](https://en.wikipedia.org/wiki/Trait_(computer_programming)) thanks to powerful function management tools like aliasing, implementation transferring, un-declaring and renaming.

Classes and traits together impose **object-oriented** capabilities of the language.

Onyx has a concept of **generics**.
Specializations of generic types may have different members and evaluate delayed macros.
Specializations of functions with generic arguments may return different values and also evaluate delayed macros.

Functions may be **overloaded** by arguments and return values.

Onyx has a concept of **annotations**, which may be applied to variables and functions.

The language defines a set of now-commonly used **arithmetic types**, including SIMD vectors, matrices and tensors, floating and fixed binary and decimal numbers, brain and tensor floats, ranges and ratios.

Onyx contains several **utility types**, such as unions, variants, tuples, anonymous structs, lambdas and runnable blocks of code.

Exceptions are designed to be truly **zero-cost** to enable exception flow in Onyx programs.

### Hello, world!

Let's jump into some code samples.
This would give a brief overview of how Onyx programs look like.

This is a very basic program written in Onyx:

```text
import "stdio.h"

# Outputs "Hello, world!"
export int main() {
  final msg = "Hello, world!\0"
  unsafe! $puts(&msg as $char*)
  return 0
}
```

In the example, a C header named `"stdio.h"` was imported into the Onyx program.
Now Onyx is aware of assembly functions declared by this header.

Later on, one of these functions, `puts` is called directly from Onyx.
An Onyx compiler can not give any safety guarantees about called assembly functions. Therefore the call must be wrapped in an `unsafe!` statement.

If something weird happens, a developer may simply `grep` the program source code for `unsafe!` statement to quickly narrow to potentially hazardous areas of code.

Imported entities are referenced with preceding `$` symbol to distinguish them from those declared in Onyx context.

The `final` statement defines a constant named `msg`.
The type of `msg` is inferred to be `String<UTF8, 14>`, i.e. a [UTF-8](https://en.wikipedia.org/wiki/UTF-8)-encoded array of [code units](https://en.wikipedia.org/wiki/Code_unit) containing 14 elements.
Note that this is not a pointer, but a real array, probably allocated on stack.

Then, the address of the `msg` constant is taken.
The resulting object of taking an address would be `String<UTF8, 14>*lr0`, which is a shortcut to `Pointer<Type: String<UTF8, 14>, Scope: :local, Readable: true, Writeable: false, Space: 0>`.

Do not be intimidated, though!
Thanks to inference, shortcuts and meaningful defaults, you'll rarely have to use full types.

The pointer to `msg` is then coerced to C type `char*`.
Such coercion would be unsafe, and a compiler would typically panic.

However, the coercion is already within the unsafe context itself thanks to the wrapping `unsafe!` statement.
No need to write `unsafe!` again.

The program above is normally compiled by an Onyx compiler, such as [`fnxc`](https://github.com/fancysofthq/fnxc), into an object file.
The object file declares the exported `int main(void)` prototype, which must be pointed to at as an entry function by a system linker.
Thankfully, this tedious operation is likely to be automatically handled by a higher-level build tool, such as [`fnx`](https://github.com/fancysofthq/fnx).

Note that Onyx does not have any implicit `__onyx_main` function, which effectively restricts non-trivial automatic static variable initialization and finalization.
But in return, it makes the emitted code predictable and portable.

### Using a Standard Library

An Onyx compiler is not required to implement any sort of OS-dependent standard library.
Instead, the standard library Standard is specified elsewhere (spoiler alert: by [the Onyx Software Foundation](#the-onyx-software-foundation)).

A standard library ought to be used as a typical package and required like any other from your code.
Again, by default, an Onyx program does not depend on any OS-specific features.

The example above could be abstracted into this when using a standard library implementation:

```text
require "std"

export void main() {
  let msg = "Hello, world!\0"

  try
    Std.puts(&msg)
  catch
    Std.exit(1)
  end
}
```

Now, the code is perfectly safe.
Even passing of `&msg` is allowed, because `Std.puts` has an overload accepting a `String*cr`, i.e. a read-only pointer with _caller_ scope, and a pointer with _local_ scope may be safely cast to _caller_ scope upon passing to a function.
This is where the full power of pointer scope harnesses!

Also note that `msg` is now a **variable** instead of a constant, as it is defined with `let` statement.
Taking the address of `msg` would return `String<UTF8, 14>*lrw0`.
Notice the `w` part?
The pointer is now writeable.
And it is perfectly legit to pass a writeable pointer as a read-only argument: it would be coerced down to a read-only pointer within the callee.

### Exceptions

We had to wrap the `Std.puts` call into the `try` block, as it could throw some system exception.
The cause is that an `export`ed function must guarantee never to throw an exception, that's why we wrapped it.
The `Std.exit` function is declared as `nothrow`, so we can leave it as-is.

But what if we wanted to inspect the backtrace of the possible exception?
Well, the language Standard states that a backtrace object must implement the `Endful<Location>` trait.
This is truncated source code of the trait:

```text
struct Location
  val path : String*sr # A static pointer
  val row, col : UBin32
end

trait Endful&lt;T>
  decl push(value: T)
  decl pop() : T
  decl pop?() : T?
end
```

Let's implement some `Stack` type to hold the backtrace.

::: spoiler ⚠️ A big chunk of non-trivial code!

```text
# A stack growing upwards in memory.
#
# The `~ %n` part means "accept a natural
# number literal as a generic argument".
class Stack&lt;Type: T, Size: Z ~ %n>
  # This class derives from this trait.
  derive Endful&lt;T>;

  # Define two empty structs.
  struct Overflow;
  struct Underflow;

  # Do not finalize this variable
  # in the end of stack lifetime.
  #
  # `@[NoFinalize]` is application
  # of an unsafe annotation.
  unsafe! @[NoFinalize]
  final array = unsafe! uninitialized T[Z]

  # A getter makes the variable read-only
  # from outside, but writeable inside.
  get size : Size = 0

  # A class, unlike a struct, does
  # not have a default initializer.
  def initialize();

  # But class allows to
  # define a finalizer!
  def finalize()
    # Only those stack elements which
    # are alive shall be finalized.
    size.times() -> unsafe! @finalize(array[&])
  end

  # Push a value into the stack.
  # Throws in case of stack overflow.
  # It implements `Endful&lt;T>:push`.
  impl push(val)
    # The scary operator is expanded to
    # `size <<= size ^+ 1`, meaning
    # "push-assign to `size` a saturated
    # sum of it with 1".
    #
    # Push-assignment returns the old
    # value instead of the new one.
    if (size ^+<<= 1) < Z
      # `<<-` moves the value from `val`
      # into the array, "ejecting" the
      # old array value. But at this point,
      # the old array value is already
      # finalized, so we explicitly disable
      # it finalization here.
      unsafe!
        @nofinalize(array[size - 1] <<- val)
      end
    else
      throw Overflow()
    end
  end

  # Pop a value from the stack.
  # Throws in case of stack underflow.
  #
  # Note the alternative syntax to
  # reference the declaration.
  impl ~Endful&lt;T>:pop()
    return pop?() ||
      throw Underflow()
  end

  # Pop a value from the stack
  # if it is not empty.
  # Returns `Void` otherwise.
  impl nothrow pop?()
    # Expands to `size <<= size ^- 1`.
    if size ^-<<= 1 > 0
      # We don't copy the array element,
      # but move it from the array.
      #
      # A copy of bytes of the element are
      # preserved in the array, but we
      # consider it already dead, a corpse.
      #
      # That's why we don't finalize it
      # in the `push` implementation.
      return unsafe! <-array[size]
    else
      return Void
    end
  end
end
```

Oof, sorry for such a seemingly complex piece of code.
But I had to do it, sooner or later!

:::

But wait!
Thankfully, the language already comes with a `Stack` implementation, so we don't need to write it in our code.

A `try` statement has optional `with` clause accepting a pointer to a `Endful<Location>` implementation.
The example above may be rewritten like this:

```text
require "std"

export void main() {
  let msg = "Hello, world!\0"
  final backtrace = Stack&lt;Location, 32>()

  try with &backtrace
    Std.puts(&msg)
  catch
    while final loc = backtrace.pop?()
      # Could've also made use of
      # `loc.row` and `loc.col`...
      Std.puts(loc.path)
    end
  catch
    # An unrecoverable error ☹️
    Std.exit(1)
  end
}
```

Now we can inspect the exception backtrace!

### An HTTP Server Example

It is considered a good tone to demonstrate how to build a simple echoing HTTP web server in your language.
This would also be my "sorry" for the big-ass `Stack` implementation above.

The thing is that running a web server is architecturally different on different target platforms.
An implementation on Linux could make use of raw sockets, an implementation on Windows could make use of the win32 `"http.h"` header etc.

Therefore, the standard library would not contain a web server implementation.
Instead, some third-party package should be used, which would inevitably be plenty of!

Let's imagine we've found one satisfying our needs.
That's how it could look like:

```text
require "std"
require "http" from "mypkg"

export int main () {
  final backtrace = Stack&lt;Location, 32>()

  try with &backtrace
    final server = HTTP::Server()

    server.get("/") ~> do |env|
      # Read the request into a
      # local `Std::Twine` instance.
      final body = env.request.read()

      # Write the twine
      # into the response.
      env.response << body
    end

    server.listen("localost", 3000)
  catch |e|
    Std.puts("Caught \@{{ e }}\n")

    while final loc = backtrace.pop?()
      Std.cout << "At " <<
        loc.path << ":" <<
        loc.row << ":" <<
        loc.col << "\n"
    end

    Std.exit(1)
  catch
    # Unrecoverable error 👿
    Std.exit(2)
  end
}
```

Thanks to powerful abstractions and type inference, you won't need to manually use `socket` each time you want to spin up a web server on Linux!

Oh, by the way, did you notice the `\@{{ e }}` thing?
It was me, <s>Dio</s> macro!

### Macros

A fundamental feature of Onyx is macros.
Macro is a Lua code generating Onyx code (or another macro code).
Yes, recursive macros are allowed, but more on that later.

Let's examine a straightforward macro example.

```text
import "stdio.h"

export void main() {
  {% for i = 0, 2 do %}
    unsafe! $puts("i = {{ i }}")
  {% end %}
}
```

The code above would expand **exactly** to:

```text
import "stdio.h"

export void main() {
  unsafe! $puts("i = 0")
  unsafe! $puts("i = 1")
  unsafe! $puts("i = 2")
end
```

That simple: the Lua code runs during compilation.
And this is not some truncated version of Lua, no.
This is a fully-fledged dynamic language, right within your compilation context.
Think of reading and parsing files during compilation, accessing system configuration...
The possibilities are endless.

You may concern about the safety of macros.
Well, yes, you have to trust the code you run.
You do trust C libraries you link to your programs, right?

However, you won't trust an NPM package, because an NPM package author does not care about their reputation, and because NPM does not have auditing features.
This is the Open-Source sustainability problem addresses in the [previous article]((/posts/2020-08-16-system-programming-in-2k20)) and potentially solved by the aforementioned [Onyx Software Foundation](#the-onyx-software-foundation).

As a result, given that you do have access to code you require, authors of packages your program depends on are appropriately rewarded for their work, and the Foundation sponsors audition of selected packages, you should be safe.

----

Back to the possibilities.
Macro use-cases include:

::: hero

**Delegating computations to compile-time**

:::

For example, you can compute a Fibonacci number sequence in a macro, and output the result right into the code.
Let's examine the following small snippet:

```text
{%
  -- Local context is preserved
  -- during this file compilation
  local function fib(n)
    local function inner(m)
      if m < 2 then
        return m
      end

      return inner(m - 1) + inner(m - 2)
    end

    return inner(n)
  end
%}

# This is a macro "function", which
# may be used directly from Onyx code.
macro @fib(n)
  {{ fib(n) }}
end

import "stdio.h"

export void main() {
  unsafe! $printf(&"%d\n", @fib(10))
end
```

In this example, `@fib(10)` would evaluate during compilation and emit a number literal `55`, so the code turns into simple `$printf(&"%d\n", 55)`.

Of course, this would increase compilation times, and it is your responsibility to find the right balance based on your needs.

----

::: hero

**Generating ORM models from SQL migration files**

:::

This is how it might look like:

```text
macro @gen_class(name)
  {%
    -- Accessing system configuration
    local db_path = os.getenv("DB_PATH")

    -- Builds "create_user" for "user.nx" file.
    -- Note that `name` variable is accessible.
    local migration_file_path =
      db_path .. "/create_" ..
        name.value .. ".sql"

    -- Requiring works as usual, so you may
    -- make use of Lua packages, even those
    -- with native C bindings!
    local myparser = require("src/sqlorm.lua")

    -- Begin emitting Onyx code
    nx.emit("class User\n")

    -- Emit a field defintion per column parsed
    local function callback(field) do
      nx.emit("let " .. field.name ..
        " : " .. field.type .. "\n")
    end

    myparser.parse(
      migration_file_path,
      callback)

    nx.emit("end")
  %}
end
```

And then in some `model/user.nx` file:

```text
# Require the file
# containing the macro
require "gen_class"

@gen_class("user")
```

Which would possibly result in:

```text
require "gen_class"

class User
  let name : String<UTF8, 128>
  let age : UBin8
end
```

----

::: hero

**Generating code based on current compilation target**

:::

Nuff said.
For example:

```text
{% if nx.target.isa.id == "amd64" then %}
  $printf("This is amd64")
{% else %}
  $printf("This is not amd64")
{% end %}
```

----

::: hero

**Having different traits for different specializations**

:::

For example, there is `Int<Base: ~ \%n, Signed: ~ \%b, Size: ~ \%n>` type in the Core API representing an integer.

Based on the value of `Base` and `Signed` generic arguments, the actual code generated for, say, summation function, would call for different instructions for signed and unsigned integers.

It may look like this:

```text
reopen Int&lt;Base: 2, Signed: S, Size: Z> forall S, Z
  impl ~Real:add(another : self) throws Overflow
    final result = unsafe! uninitialized self
    final overflowed? = unsafe! uninitialized Bit

    \{%
      local s = nx.scope.S.val and "s" or "u"
      local t = "i" .. nx.scope.Z.val
    %}

    unsafe! asm
    template llvm
      %res = call {\{{ t }}, i1} @llvm.\{{ s }}add.\
      with.overflow.\{{ t }}(\{{ t }} $0, \{{ t }} $1)
      $2 = extractvalue {\{{ t }}, i1} %res, 1
    in r(this), r(another)
    out =r(overflowed?)
    end

    if overflowed?
      throw Overflow()
    else
      unsafe! asm
      template llvm
        $0 = extractvalue {\{{ t }}, i1} %res, 0
      out =r(result)
      end

      return result
    end
  end
end
```

This is a fairly complex example making use of the inline assembly feature.
But this is what the language is capable of.

Notice that delayed macro blocks, i.e. those beginning with `{{`, are evaluated on every specialization, so the contents of the `add` function would be different for `Int<Base: 2, Signed: true, Size: 16>` (a.k.a. `SBin16`) and `Int<Base: 2, Signed: false, Size: 32>` (a.k.a. `UBin32`).

There were other features of Onyx mentioned in the example: 1) reopening certain or broad (the `forall` thing), specializations, 2) aliasing.
In fact, this is how integer aliasing looks like in the Core API:

```text
# `IBin8` and `Bin8` are
# both binary integer types.
alias IBin&lt;*>, Bin&lt;*> = Int&lt;2, *>

# Use a macro to DRY the code.
private macro @alias_binary_sizes(id)
  alias \{{ id }}8 = \{{ id }}&lt;8>
  alias \{{ id }}16 = \{{ id }}&lt;16>
  alias \{{ id }}32 = \{{ id }}&lt;32>
  alias \{{ id }}64 = \{{ id }}&lt;64>
  alias \{{ id }}128 = \{{ id }}&lt;128>
end

# Signed binary integers.
alias SIBin&lt;*>, SBin&lt;*> = IBin&lt;true, *>
@alias_binary_sizes("SIBin")
@alias_binary_sizes("SBin")

# Unsigned binary integers.
alias UIBin&lt;*>, UBin&lt;*> = IBin&lt;false, *>
@alias_binary_sizes("UIBin")
@alias_binary_sizes("UBin")
```

----

Macro code can generate other macro code.
The algorithm is to evaluate immediate macros (e.g. `{% %}`) immediately once they are met in the code by some lexer, but evaluate delayed macros (e.g. `\{% %}`) only when the time is right, for example, per specialization.

Apart from simply `print "Debug"`, Lua contains powerful debugging facilities, e.g. `debug()`.
This means that you can debug your compilation, even with breakpoints from an IDE!

### Complex Types

Onyx type system comprises two types of an object: real and imaginary. Hence the name "complex".

Real type is the actual type with a concrete memory layout, while the imaginary type is how a compiler traits this object.

Together with trait types, this approach meets the maintainability goal [set](/posts/2020-08-16-system-programming-in-2k20/#the-new-beginnings) in the previous article.

Consider the following example:

```text
trait Drawable2D
  decl draw()
end

struct Point
  derive Drawable2D
    impl draw()
      # Draw the point
    end
  end
end

struct Line
  derive Drawable2D
    impl draw()
      # Draw the line
    end
  end
end

def do_draw(x ~ Drawable2D)
  x.draw()
end
```

Within the `do_draw` function `x` initially has type `Undef~Drawable2D`, where `Undef` is the real type, and `Drawable2D` is the imaginary type.

Having an `Undef` real type in an argument declaration implies that this argument is generic.
In other words, for each unique real type specialization of `x`, the function would specialize once again.

Let's modify the function a bit:

```text
def do_draw(x ~ Drawable2D)
  {% print("Immediate: " ..
    nx.ctx.x.real_type:dump()) %}

  \{% print("Specialized: " ..
    nx.ctx.x.real_type:dump()) %}
end

do_draw(Point())
do_draw(Line())
```

The compiler would output the following:

```text
Immediate: Undef
Specialized: Point
Specialized: Line
```

We can see that `Undef` specialized into a concrete type in a function specialization.

Would `x.draw()` work within such a function?
Indeed it would because the imaginary type is set to `Drawable2D`.
In other words, `x` has **behaviour** of `Drawable2D` and thus can be called its methods upon.

It is still possible to operate on a real type in this case thanks to type information known at compile-time:

```text
def do_draw(x ~ Drawable2D)
  \{% if nx.ctx.x.real_type == nx.lkp("Point") %}
    # x : Point # Panic! It is still `Undef`
    # x.point_specific_method # Panic!
    (unsafe! x as Point).point_specific_method
  \{% end %}
end
```

`x.point_specific_method` would cause compiler panic, because it can not guarantee that this would work for every possible x **now and in the future**.
This solves the potential issue when calling `do_draw` with a new type unexpectedly breaks the callee; in other words, incapsulation is preserved.

The language contains some syntax sugar to simplify the example above:

```text
def do_draw(x ~ Drawable2D)
  if x is? Point
    x : Point # OK
    x.point_specific_method
  end

  # # For the sake of scope incapsulation,
  # # can not do that outside of the branch.
  # x.point_specific_method # Panic!
end
```

Imagine that we add another trait with the same declared function.
It Onyx, the collision must be resolved, but the collided functions can still be called by their original names after restricting the caller's imaginary type.
For example:

```text
trait Drawable3D
  decl draw()
end

reopen Point
  derive Drawable3D
    impl draw() as draw3d
      # Draw point in 3D
    end
  end

  # Move the existing implementation
  # under another name
  moveimpl ~Drawable2D:draw() to draw2d
end
```

Luckily, no changes have to be made to the `do_draw()` function, because the compiler treats the argument solely as `Drawable2D`, and calling `draw()` on it always calls `Drawable2D:draw()`!
Again, changing the type from outside would not break a callee.
Incapsulation at its finest!

### More Highlights

Some more highlights of the language's features:

  * SIMD vectors and matrices built-in with literals.
  It looks like this:

    ```text
    let vec = &lt;1, 2, 3, 4>
    vec : Vector&lt;SBin32, 4>

    # Note: `0` means row-
    # oriented matrix
    let mat = |[1, 2], [3, 4]|r
    mat : Matrix&lt;SBin32, 2, 2, 0>
    ```

    In fact, `Vector` and `Matrix` are specializations of a more general `Tensor` type.

    ```text
    primitive Tensor&lt;
      Type: T,
      Dimensions: *D ~ \%n,
      Leading: L ~ \%n>;

    alias Matrix&lt;
      Type: T,
      Rows: R ~\%n,
      Cols: C ~\%n,
      Leading: L ~ \%n
    > = Tensor&lt;T, R, C, L>

    alias Vector&lt;
      Type: T,
      Size: Z
    > = Tensor&lt;T, Z, 0>
    ```

  * "Magic" literals inspired by Ruby:

    ```text
    let vec = %i&lt;1 2 3 4>
    let mat = %i|[1 2][3 4]|r
    let ary = %f64[1 2 3]
    ```

  * [IEC](https://en.wikipedia.org/wiki/Kibibyte) and [SI](https://en.wikipedia.org/wiki/Kilobyte) numerical literal prefixes:

    ```text
    # Kibi
    @assert(42Ki == 43_008)

    # Femto
    @assert(42ff64 ~=
      0.000_000_000_000_042)

    # Mega and milli
    @assert(42M.17mf64 ~=
      42_000_000.017)
    ```

  * String and character literals with default UTF-8 encoding and UCS charset.
  The language allows custom string and character literal suffixes for custom encodings.

    ```text
    final u8 = "Привет, мир!"
    u8 : String&lt;UTF8, 21>
    @assert(@sizeof(u8) == 21)

    final u16 = "Привет, мир!"utf16le
    u16 : String&lt;UTF16LE, 24>
    @assert(@sizeof(u16) == 24)

    # ASCII-US is NOT a built-in encoding
    final ascii = "Hello, world!"asciius
    ascii : String&lt;ASCII, 13>
    @assert(@sizeof(ascii) == 13)

    final c = 'ф'
    c : Char&lt;UCS>
    @assert(@sizeof(c) == 4)
    ```

  * Distinct aliasing allows having a type with different methods, but the same layout.
  For example, the `String` type is a distinct alias to an array of codeunits:

    ```text
    distinct alias String&lt;
      Encoding: E,
      Size: Z
    > = Array&lt;Codeunit&lt;E>, Z>
      # This method is only declared
      # for strings, not arrays.
      decl get_char(position : UBin32)
    end
    ```

  * `Any` real type implies a variant of all possible types.
  In practice, it is often constrained by an imaginary type to reduce the number of contained options and define behaviour.
  For example:

    ```text
    trait Logger
      decl log()
    end

    class Processor
      # Stores a variant of all possible
      # `Logger` implementations.
      let logger : Any~Logger

      def process()
        # This is still any logger
        logger : Any~Logger

        # Thanks to its imaginary type,
        # can call the declared method
        logger.log()
      end
    end

    struct MyLogger
      derive Logger
        impl log()
          # Some implementation
        end
      end
    end
    ```

----

I could continue digging into Onyx features and examples, but for an introductory post, that should be enough.

However, a good language by itself is only a half successful endeavour.
Any new language needs a good foundation, ensuring the growth of its ecosystem.
This is where the Onyx Software Foundation comes into play.

## The Onyx Software Foundation

The Onyx Software Foundation ([NXSF](https://nxsf.org)) is to be an official 501 \(c\) non-profit organization, so donations made to it are tax-exemptive.

All NXSF processes are going to be transparent and open.

### Standards

The Foundation will be governing several major and auxiliary standard specifications related to Onyx:

  1. [The Onyx Programming Language Specification](https://github.com/nxsf/onyx).
  The specification includes the following:

      1. Language specification, including macro API specification.

      1. Platform identifiers specification.
      For example, `amd64`, not `x86_64`.
      The list includes [ISA](https://en.wikipedia.org/wiki/Instruction_set_architecture)s with meaningful default <abbr title="Instruction Set Extensions">ISE</abbr>s, modern processing units list (e.g. `skylake`) with set of enables ISEs for them, operating systems and ABIs.

      1. Portable API format informative specification.
      So that raw API documentation generated by a compiler may be used by different documentation visualizers.

      1. Expected optimizations informative specification.
      So a user may safely rely on compiler optimizations, e.g. loop unrolling.

  1. The Onyx Standard Library Package Specification.
  Basically, a set of declarations which standard library package implementations shall obey.

  1. The Onyx Package Management Specification.
  Defines client and server side APIs for relieable package acquisition.
  This includes versioning algorithms and, for example, requiring third-party auditions.

  1. The Onyx Compiler Interface Specification.
  So different compiler implementations had a unified interface to interact with, using DSON.

  1. [Dead-Simple Object Notation (DSON) Specification](https://github.com/nxsf/dson).
  This format is intended to be used in CLI to describe complex object structures.

  1. [DSON Schema Specification.](https://github.com/nxsf/dson-schema)
  The standard to describe objects in DSON.

Standardization process will be official, with responsible committees consisting of community-elected members called _community champions_, and businesses sponsoring the Foundation.
The votes will be split evenly between community and businesses to represent both sides fairly.

### Package Hosting

NXSF will provide a free Onyx package hosting platform.

To be eligeble for hosting, a package shall have an OSI-approved license.

NXSF will provide funding for packages both based on the [source-on-demand](/posts/2020-08-16-system-programming-in-2k20/#source-on-demand) model and selectively chosen by a Foundation committee.

In addition to monetary funding, NXSF would also sponsor recurring security auditions of selected packages.

### Funding the Ecosystem

Apart from funding packages, the Foundation will sponsor projects and events related to Onyx, including teaching conferences, teaching materials, integrations etc.

----

Onyx is the perfect balance between productivity and performance, a language understandable well both by humans and machines.

Thanks to powerful abstraction mechanisms and inference, the areas of the appliance are truly endless.
I heartfully believe that Onyx may become a new lingua franca for decades until humanity learns to transfer thoughts directly into machines.

Visit [nxsf.org](https://nxsf.org) to stay updated, and...

----

::: hero

<big>Enjoy the performance.</big>

:::

----

P.S: Until the Foundation is officially established, you may consider [sponsoring me directly](/posts/2020-08-27-sponsoring-onyx/) and joining the conversation on the [forum](https://forum.onyxlang.com).
