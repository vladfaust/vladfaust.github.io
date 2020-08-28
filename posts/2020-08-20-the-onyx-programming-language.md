---
title: The Onyx Programming Language
location: Moscow, Russia
---

In the [previous article](/posts/2019-08-01-system-programming-in-2k20) I successfully justified my desire to build yet another system programming language.
Unlike _others_, I want to do it right from the very beginning.
Meet Onyx!

<!-- excerpt -->

<h2>Table of Contents</h2>

${toc}

## The Onyx programming language

![The language logo, an Onyx-black panther](../../../public/img/onyx-logo.png =60%x)

Onyx is a general-purpose statically typed programming language suitable both for application and system programming.

### Top-Down Features

Onyx syntax is inspired by **C-family** languages, such as Ruby, C++ and even <s>Rust</s> <small>I'm sorry</small>.

Onyx imposes powerful **inference** mechanisms.
The rule is generally "infer unless ambiguous", with meaningful defaults.

Onyx is a **memory-safe** language.
There are multiple levels of enforced safety, with `unsafe` being the minimum safety level allowing for extreme optimizations.
This opens great opportuinites for powerful abstractions.

Unlike [_other_](https://www.rust-lang.org/){.secret-link} languages, Onyx treats **pointer arithmetic** as a first-class use-case, but with memory safety.
The concept is expressed in raw but typed pointers containing a memory scope.
For example, it is not possible to safely pass a local pointer to an outer scope.
Moreover, pointers preserve low-level features like address spacing and alignment.

It is extremely easy to do **interoperability** in Onyx.
In fact, Onyx is similar to C++ in this sense: C code is considered a part of the program (with minor differences), and it is simple to export Onyx code as a shared library.

Programs written in Onyx are **cross-platform** by default in the sense of that there are no target-dependent features in the language itself: no threading, no memory control.
But fear not, thanks to powerful abstractions, these are likely to be already implemented by someone else!

Onyx introduces **powerful macros** written in Lua.
It allows to re-use existing Lua code and have full access to the compilation context thanks to easy debugging with Lua.

Onyx has **<u>[simple-to-understand](https://twitter.com/vladfaust/status/1299116755596566528){.secret-link}</u> lifetime and moving** concepts naturally built into the language.
Instead of fighting with a borrow checker, simply get an address of a variable: a compiler would not allow you to mis-use it.

Classes may have a finalizer defined and thus have **automatic resource control**.

Onyx implements real **traits** as [composable units of behaviour](https://en.wikipedia.org/wiki/Trait_(computer_programming)) thanks to powerful function management tools like aliasing, implementation transferring, un-declaring and renaming.

Classes and traits together impose **object-oriented** capatibilites of the language.

Onyx has a concept of **generics**.
Specializations of generic types may have different members, and evaluate delayed macros.
Specializations of functions with generic arguments may return differnt values and also evaluate delayed macros.

Functions may be **overloaded** by arguments and return values.

Onyx has a concept of **annotations**, which may be applied to variables and functions.

The language defines a set of now-commonly used **arithmetic types**, including SIMD vectors, matrices and tensors, floating and fixed binary and decimal numbers, brain and tensor floats, ranges and ratios.

Onyx contains a number of **utility types**, such as unions, variants, tuples, anonymous structs, lambdas and runnable blocks of code.

Exceptions are designed to be truly **zero-cost** to enable exception flow in Onyx programs.

### Examples

Let's jump into some code samples.
This would give a brief overview of how Onyx programs look like.

#### Hello, world!

This is a very basic program written in Onyx:

```text
import "stdio.h"

export int main() {
  final msg = "Hello, world!\0"
  unsafe! $puts(&msg as $char*)
  return 0
}
```

In the example, a C header named `"stdio.h"` was imported into the Onyx program.
Now Onyx is aware of assembly functions declared by this header.

Later on, one of these functions, `puts` is called directly from Onyx.
An Onyx compiler can not give any safety guarantees in regard to called assembly functions, therefore the call must be wrapped in an `unsafe!` statement.

If something weird happens, a developer may simply `grep` the program source code for `unsafe!` statement to quickly narrow to potentially hazardous areas of code.

Imported entities are referenced with preceding `$` symbol to distinguish them from those declared in Onyx context.

A constant named `msg` is defined by the `final` statement.
The type of `msg` is inferred to be `String<UTF8, 14>`, i.e. a [UTF-8](https://en.wikipedia.org/wiki/UTF-8)-encoded array of [code units](https://en.wikipedia.org/wiki/Code_unit) containing 14 elements.

Then, address of the `msg` constant is taken.
The resulting object of taking an address would be `String<UTF8, 14>*lr0`, which is a shortcut to `Pointer<Type: String<UTF8, 14>, Scope: :local, Readable: true, Writeable: false, Space: 0>`.

Do not be intimidated, though!
Thanks to inference, shortucts and meaningful defaults, you'll rarely have to use full types.

The pointer to `msg` is then coerced to C type `char*`.
Such a coercion would be unsafe, and a compiler would normally panic.

However, the coercion is already within unsafe context itself thanks to the wrapping `unsafe!` statement.
No need to write `unsafe!` again.

The program above is normally compiled by an Onyx compiler, such as [`fnxc`](https://github.com/fancysofthq/fnxc), into an object file.
The object file declares the exported `int main(void)` prototype, which must be pointed to at as a entry function by a system linker.
Thankfully, this tedious operation is likely to be automatically handled by a higher-level build tool, such as [`fnx`](https://github.com/fancysofthq/fnx).

Note that Onyx does not have any implicit `__onyx_main` function, which effectively restricts non-trivial automatic static variable initialization and finalization.
But in return it makes the emitted code predictable and portable.

#### Using a standard library

An Onyx compiler is not required to implement any sort of OS-specific standard library.
Instead, the standard library Standard is specified elsewhere (spoiler alert: by [the Onyx Software Foundation](#the-onyx-software-foundation)).

A standard library is ought to be used as a common package and required as any other from your code.
Again, by default an Onyx program does not depend on any OS-specific features.

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
Even passing of `&msg` is allowed, because `Std.puts` has an overload accepting a `String*cr`, i.e. a read-only pointer with _caller_ scope, and a pointer with _local_ scope may be safely cast to to _caller_ scope upon passing to a function!

Also note that `msg` is now a variable, as it is defined with `let` statement.
Taking address of `msg` would return `String<UTF8, 14>*lrw0`.
Notice the `w` part?
The pointer is now writeable.
And it is perfectly legit to pass a writeable pointer as a read-only argument: it would be coerced down to a read-only pointer within the callee.

#### Exceptions

We had to wrap the `Std.puts` call into the `try` block, as it could throw some system exception.
The cause is that an `export`ed function must guarantee to never throw an exception, that's why we wrapped it.
The `Std.exit` function is declared as `nothrow`, so we can leave it as-is.

But what if we wanted to inspect the backtrace of the possible exception?
Well, the language Standard states that a backtrace object must implement `Endful<Location>` trait.
This is a truncated source code of the trait:

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

::: spoiler ⚠️ A big chunk of code!

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

#### An HTTP server example

It is considred a good tone to demonstrate on how to build a simple echoing HTTP web server in your language.
This would also be my "sorry" for the big-ass `Stack` implementation above.

The thing is that running a web server is architecturally different on different target platforms.
An implementation on Linux could make use of raw sockets, an implementation on Windows could make use of the win32 `"http.h"` header etc.

Therefore, the standard library would not contain a web server implementation.
Instead, some third-party package should be used, which would inevitably be a plenty of!

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
    Std.puts("Caught \@{&#123; e }}\n")

    while final loc = backtrace.pop?()
      Std.cout << "At " <<
        loc.path << ":" <<
        loc.row << ":" << "\n"
    end

    Std.exit(1)
  catch
    # Unrecoverable error 👿
    Std.exit(2)
  end
}
```

Thanks to powerful abstractions and type inference, you won't need to manualy use `socket` each time you want to spin up a web server on Linux!

Oh, by the way, did you notice the `\@{&#123; e }}`\* thing?
It was me, <s>Dio</s> macro!

\* <small>TODO: Fix this HTML weirdness.</small>

#### Macros

TODO: Example on macros.
Simple macros.
Breakpoints in compile-time, code generation based on external configurations, e.g. of ORM models from SQL migration files.

## The Onyx Software Foundation

TODO: List all the standards.
Official standard development process with RFSs, voting, community champions.
Canonical package hosting platform with built-in funding based on the source-on-demand model.

<!-- TODO: Link the system programming article for justification.

TODO: Describe Onyx features, why it's better than other languages.

TODO: Describe NXSF.

TODO: Link the donating page. -->
