---
title: System Programming in 2k20
location: Moscow, Russia
---

System programming is still important, but is seems to be much harder than application programming.
Why is that and how to overcome this -- these are the questions I'll try to find answers for in this article.

<!-- excerpt -->

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<h2>Table of Contents</h2>

${toc}

## Introduction

A hundred years ago, a person could not imagine to be able to play any musical instrument they want, to create new interactive worlds, or to launch cars into space.
A life was simply not enough.

Then machines came.
Silicon computations allowed us, mere mortals, prolong our lives virtually and literally.

Music creation software, game development engines, 2D and 3D editors, neural networks, AI and machine learning, motion capturing, navigation, medicine, wearable devices, smartphones...
Thanks to these, a person now can do a lot of things while having more free time during their lifespan.

It all happened because a human learned to communicate with machines with means of programming languages.
Early inventors of the future were extremely intelligent people able to coin fundamentally new concepts which last until today.

But this is the how the humanity evolves: we accumulate knowledge and pack, shortcut it.
We don't need to keep in head proofs of every mathematical theorem, and we don't need to fully undrestand the nature of an axiom.
Instead, we store theorem and axiom statements.
With that in mind, we have more space to solve new problems.

The same applies to programming.
Those brilliant people inevitably become old, as real system programming knowledge fades away.
On the surface, the amount of those who really understands how machines work seems to shrink.

<figure>
  <blockquote class="twitter-tweet" data-lang="en" data-dnt="true">
    <p lang="en" dir="ltr">Also this. My aim is to bring ’96 back for ‘20s devs <a href="https://t.co/avFQxxIfpP">pic.twitter.com/avFQxxIfpP</a></p>&mdash; Vlad Faust (@vladfaust) <a href="https://twitter.com/vladfaust/status/1264117331820711936?ref_src=twsrc%5Etfw">May 23, 2020</a>
  </blockquote>

  <figcaption>Hey, that's me!</figcaption>
</figure>

"But I can run a newural network with Python!", one would argue.
Well, who do you think develops TensorFlow itself?
TensorFlow [isn't written in Python](https://github.com/tensorflow/tensorflow), kid.

Writing a game in Lua or Ruby is totally possible, as well as creating a messenger or code editor in Electron.
However, Electron, as any mature game engines, are still written in [C++](https://github.com/electron/electron).

Almost any meaningful software which needs to utilize a machine with more than [20%](https://en.wikipedia.org/wiki/Pareto_principle){.secret-link} efficiency, is written in a system programming language.

::: hero

System programming is the foundation of the development of the human civilization.{style="font-size: 2.25rem"}

:::

Regardless of its importance, system programming seems to be less popular than application programming, because it's known to be harder to both learn and master.
It is definetely easier to spin up a web server, connect it to a database, set up some Stripe integration, drink smoothie and proudly call yourself an enterpruener.

But that does not invest into the the human civialization's progress on the Kardashov's scale.
<mark>The humanity will still depend on system programming in the foreseeable future.</mark>
And we need new, fresh blood there.

In this article, I'll try to take a peek on the current state of the system programming, find out why it's not that popular and and choose the best system programming language for the Next Big But Fairly-Low-Level Project (tm).

## Choosing the Right Language

When choosing a serious language for serious system programming, the choice is broad: it's either C, C++, Rust, or one of the many new LLVM-based projects.

### C

C is great at its simplicity, but bigger projects require higher level language features, such as [memory control](https://twitter.com/jfbastien/status/1289305925199650816), object hierarchy, lambdas etc.; therefore, C is out of competition here.

Ditto applies to C "replacements", such as [Ẕ̴̰̥̔͝i̷̥̣̍̓̉ġ̷̢̪͌̾́](https://ziglang.org/) and [Patreon-lang](https://vlang.io/).

### C++

C++ is the grandfather of higher-level system programming.

It offers powerful features with a grain of Unix epoch practices and great amount of undefined behaviour.
Funnily enough, an experienced C++ programmer shall aware of not what C++ is, but of what it is not, i.e. undefined behaviour of the language.

That said, developing on C++ is pain, and it is easy to shoot your lower parts off by, say, returning a lambda with a closured local variable.
Of course, it is possible to have a fancy third-party UB checking tool, but such a tool would never be perfect considering the amount of UB in the language itself.

Another Unix anachronism C++ inherits is the backwards compatibility with a bitter taste of Postel's law: "most compilers implement that feature in different ways, let's put it into the language after a short thought with design averaging from existing implementations!".
One may argue that backwards compatibility is a good thing, but let me postpone this discussion for a [later section](#backwards-compatibility) of this article.

### Rust, pt. 1

Rust is a fairly young programming language with a reputable mission: empower everyone to build reliable and efficient software.
Let's deconstruct the statement.

One of the game-changing features of Rust is separation between safe and unsafe code.
The ability to isolate volatile code worths a lot: if anything goes wrong, then you simply `grep` your codebase with `unsafe` filter and voilà -- all the dangerous invocations are at your hand sight.
It also allows _the_ implementation to perform crazy optimizations, say, by entirely removing parts of code; and it's fine, because there is no unsafe access to that code.
As a result, focusing on volatile code becomes easier, and nasty bugs are squashed faster.

Otherwise, _the_ Rust compiler would yell at you, pointing at your mistakes in the safe code area.
And those yells are detailed enough, so most of the time you have a clean picture on why you're wrong and what to do with that.

Compared to C++, Rust compilation process is much friendlier and catches more bugs before you face them in runtime.

![I just wanted to sort an array](/public/img/posts/2020-08-16-system-programming-in-2k20/errors-in-langs.jpg "How different compilers react to user errors" =100%x)

Another good thing about Rust is macros.
Well, what's good is the idea of macros; the implementation of macros in Rust is um... questionable.
Nevertheless, macros allow to write code in code with much greater flexibility than with C++ preprocessor and constant expressions.
Nuff said, macros are must-have in modern languages.

The built-in crates system Rust has brings powerful abstractions into the ecosystem.
Those folks enjoying lower-level programming and having enough skills to do so can wrap unsafe, but performant code, into simple, but safe abstractions.
And those who have a need to just make things work, may (comparably) [easy adopt those crates](https://www.theregister.com/2020/01/21/rust_actix_web_framework_maintainer_quits/).

----

<!-- ![Checkpoint!](../../../public/img/posts/2020-08-16-system-programming-in-2k20/checkpoint.svg =100%x) -->

Rust really does allow to build _reliable_ (no undefined behaviour in-the-wild) and _efficient_ (thanks to the zero-cost philosophy) software to _everyone_ (with powerful abstractions).

But, there are always some "but<sub>t</sub>s".

First of all, only a few may say Rust has friendly syntax.
In the maniacal pursuit for the absolute memory safety, the language introduces plethora of abstractions such as borrow checker, six string types (hey, we're making a language here, not a guitar), `Mut`, `Box`, `Arc`, `Trait`, requiring to do those ubiquitous `unwrap()`, `as_ref()` and `borrow()` (often chained) literally before every access.

Some may call it "hipster thinking", but those small spikes like mandatory semicolons\*, curly brackets wrapping, and othwerwise unintuitive design decisions like constantly "screaming code" with ubiquitous bangs (`!`) and overloaded documentation semantics — they make writing and reading Rust code harder.
Definetely harder than Ruby or, say,
J̸̧̨̹͈̦̏̅͒̈́͂͐̄̾͟͟ͅȃ̡͎̯̟̦͉͂͊̿̈́v̢̡͖͍̻̳̞͌͌̈̋̐͌̆͜a̴͖̱̟̩̹̘̺͊̃̋̇̾̀̀͐̊͐ͅS̶͚̣̥͚͈̥̤͔̾̎̎̿̔͊̋̉̓c̶̡̧̗̻̊̈̋̍̔̂̅̓̚͘͢ŗ̰͖̲̙͖͕̂̏̍͑̊̋ḯ̸̛̤̦̠͈̩̙̯̘̥̖̅́̊̀͑̕͠͠p̸̨̧̨̧̡̛̮̯͖̹͈̉̑̿͛̎̀͌̾͞ț̸̩͕͈̊͐̏̏̕͡ͅ
.


::: off

\* In fact, semicolons are not mandatory _everywhere_, which brings even more confusion.

From [StackOverflow](https://stackoverflow.com/questions/26665471/are-semicolons-optional-in-rust):

> Semicolons are generally not optional, but there are a few situations where they are. Namely after control expressions like `for`, `if/else`, `match`, etc.

[Bruh.](https://www.myinstants.com/media/sounds/movie_1.mp3){.secret-link}

:::

A [wise man](https://en.wikipedia.org/wiki/Jason_Statham){.secret-link} once said:

> The complexity of a language feature is proportional to the amount of articles explaining the feature.

Here goes a tiny fraction of reads on why Rust is not even nearly to an intuitive language:

  1. [Common Rust Lifetime Misconceptions](https://github.com/pretzelhammer/rust-blog/blob/master/posts/common-rust-lifetime-misconceptions.md)

  1. [What Not to Do in Rust](https://blog.sentry.io/2018/04/05/you-cant-rust-that?utm_content=137995710)

  1. [Frustrated? It's not you, it's Rust](https://fasterthanli.me/articles/frustrated-its-not-you-its-rust)

  1. [Understanding lifetimes](https://www.reddit.com/r/rust/comments/ic67tm/understanding_lifetimes/) (the subreddit itself is straight proof of how insanely complex the language is)

  1. [Understand smart pointers in Rust
](https://stackoverflow.com/questions/55075458/understand-smart-pointers-in-rust) (the StackOverflow tag is full of that gold)

  1. [Clear explanation of Rust’s module system](http://www.sheshbabu.com/posts/rust-module-system/)

The following is my personal collection of "why I love Rust".

::: spoiler ⚠️ Lots of nasty tweets inside

<figure>
  <blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">The learning curve of <a href="https://twitter.com/rustlang?ref_src=twsrc%5Etfw">@rustlang</a> for whoever is used to GC languages is steep but very interesting. Like, this code does *not* compile in Rust, but it actually makes a lot of sense 🤯:<a href="https://twitter.com/hashtag/programming?src=hash&amp;ref_src=twsrc%5Etfw">#programming</a> <a href="https://t.co/yLru0bQ0gV">pic.twitter.com/yLru0bQ0gV</a>
    </p>&mdash; Rémi Sormain (@RSormain) <a href="https://twitter.com/RSormain/status/1287395421736898560?ref_src=twsrc%5Etfw">July 26, 2020</a>
  </blockquote>

  <figcaption>No, it does not</figcaption>
</figure>

<figure>
  <blockquote class="twitter-tweet"><p lang="en" dir="ltr">A nasty compiler error to start the morning. (pages of this) <a href="https://t.co/vvMqcOsYcC">pic.twitter.com/vvMqcOsYcC</a></p>&mdash; Luca Palmieri 🦊 (@algo_luca) <a href="https://twitter.com/algo_luca/status/1286935357083340801?ref_src=twsrc%5Etfw">July 25, 2020</a></blockquote>

  <figcaption>You'd better start with coffee</figcaption>
</figure>

<figure>
  <blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">This is fine, just a perfectly normal function signature. <a href="https://t.co/qotj5f3ndb">pic.twitter.com/qotj5f3ndb</a>
    </p>&mdash; Bodil Stokke, Esq. (@bodil) <a href="https://twitter.com/bodil/status/1259127749169631232?ref_src=twsrc%5Etfw">May 9, 2020</a>
  </blockquote>

  <figcaption>That's alright, they find a way to reduce it in the replies</figcaption>
</figure>

<figure>
  <blockquote class="twitter-tweet"><p lang="en" dir="ltr">What is this even.<a href="https://t.co/0oUvVMJYEC">https://t.co/0oUvVMJYEC</a></p>&mdash; James Munns (@bitshiftmask) <a href="https://twitter.com/bitshiftmask/status/1227021520133853184?ref_src=twsrc%5Etfw">February 11, 2020</a></blockquote>

  <figcaption>Those signatures tho</figcaption>
</figure>

<figure>
  <blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">when my backend looks like this so her frontend can look like that <a href="https://t.co/xV4d6bi7ge">pic.twitter.com/xV4d6bi7ge</a></p>&mdash; Yaah 🦀 (@yaahc_) <a href="https://twitter.com/yaahc_/status/1293411590964830208?ref_src=twsrc%5Etfw">August 12, 2020</a>
  </blockquote>

  <figcaption>ditto</figcaption>
</figure>

<figure>
  <blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Methods with a variable number of parameters in <a href="https://twitter.com/rustlang?ref_src=twsrc%5Etfw">@rustlang</a>.<br><br>AMA.<br>😭 <a href="https://t.co/IJ77fMLGPp">pic.twitter.com/IJ77fMLGPp</a></p>&mdash; Luca Palmieri 🦊 (@algo_luca) <a href="https://twitter.com/algo_luca/status/1296732882237612034?ref_src=twsrc%5Etfw">August 21, 2020</a>
  </blockquote>

  <figcaption>Did someone said "macros"?</figcaption>
</figure>

<figure>
  <blockquote class="twitter-tweet"><p lang="en" dir="ltr">What is the correct <a href="https://twitter.com/rustlang?ref_src=twsrc%5Etfw">@rustlang</a> borrowing trait to impl for a wrapper type that enforces an invariant (i.e. NonZero*) but where otherwise you want it to be usable anywhere the inner type is usable? (note: poll, not quiz)</p>&mdash; Tony “Abolish (Pol)ICE” Arcieri 🦀 (@bascule) <a href="https://twitter.com/bascule/status/1299084955025203200?ref_src=twsrc%5Etfw">August 27, 2020</a></blockquote>

  <figcaption>What. The. Fuck.</figcaption>
</figure>

:::

And sorry for these (you can open them in a new tab to enlarge (but please don't)).

![](../../../public/img/posts/2020-08-16-system-programming-in-2k20/rust-is-simple-1.jpg =100%x)
![](../../../public/img/posts/2020-08-16-system-programming-in-2k20/rust-is-simple-2.jpg =100%x)
![](../../../public/img/posts/2020-08-16-system-programming-in-2k20/rust-is-simple-3.jpg =100%x)

----

<mark>Rust is more confusing than C++</mark>, change my mind.
On the one side, _the_ compiler is always watching your moves, and it is responsible for ensuring protection from undefined behaviour...
But that power comes at the price of unfriendly, clumsy, cumbersome syntax with lots of unintuitive abstractions and repetitive actions.
Now, instead of keeping in mind of where C++ might blow, one shall be aware all the abstractions Rust brings in to choose the right one, <small>and where to place a semicolon</small>.

That said, the "for everyone" clause in the mission statement seems unfair to me now.
It takes great effort to become fluent in Rust.

Regarding to other two clauses in the Rust's mission, I still have no claims on them.
Rust programs are known to be fairly performant (<small>if you ever manage to wait until `rustc` compiles with optimizations turned on</small>), and there is even the academia-grade [RustBelt](https://plv.mpi-sws.org/rustbelt/) organization ensuring the UB-safety.

You can always find more on what's good, bad and ugly about Rust, but the main point is that <mark>the language is not ideal</mark>, and there is definitely room for improvements.
Plus one point to the justifying.

### Challengers Worth Mentioning

There are some other noteworthy languages, which nevertheless do not fit my requirements for [various reasons](https://en.wikipedia.org/wiki/Not_invented_here).

#### Julia

[Julia](https://julialang.org/) is quite a mature language focused on **scientific research**.

First of all, I'm interested in a general-purpose language.
I want to be able to create mainstream GUI applications, microservices and 3D engines, while Julia is focused on multi-dimensional arrays and plots.

::: spoiler Second of all,

![This](../../../public/img/posts/2020-08-16-system-programming-in-2k20/jit-is-slow.jpg "JIT is slow meme" =70%x)

:::

You can find more on why not Julia [here](https://www.zverovich.net/2016/05/13/giving-up-on-julia.html), with critique addressed [here](https://www.reddit.com/r/Julia/comments/629qkz/about_a_year_ago_an_article_titled_giving_up_on/).

#### Nim

[Nim](https://nim-lang.org/) is a magnificent piece of art.

But it has a Python-like indentation-based syntax with less flexible `import` semantics.
It lacks proper object-oriented features like interfaces and mixins.
And it does not have lower-level features like pointer arithmetics, address spaces etc.

#### Crystal

I love the core idea behind Crystal.
I don't like its implementation.

They are saying that [Crystal](https://crystal-lang.org/) is a general-purpose programming language, but that's not true.
The language and its core team are focused on their needs, which is solely an amd64-linux platform.

The standard library is bloated with heavy dependencies like `libxml` and `libyaml`, the language itself has GC, event loop and unwinding-based exceptions (i.e. a runtime) built-in, and it's therefore hardly possible to ship an executable for purposes other than serving requests over HTTP.

After almost 10 years in development, the core team still has disagreements in the fundamental design, and you may commonly see controversial claims by its officials regarding to the Crystal's future on the forum.
They even can not decide if Crystal is a compiled Ruby or something else.

<!-- TODO: Reference example issues and posts here. -->

Regarding to the amount of bugs the only implementation has...
Once you dig a little bit deeper, it all begins to explode.
Macros, generics, unions, interoperability: it may blow up anywhere.
A core team [representative](https://github.com/asterite){.secret-link} without "core team" badge will then appear telling you that <small>it's not a bug, or wait, it is a bug, but it can not be fixed, oh wait, it can be fixed, but it's not a bug, issue closed, thanks</small>.

<!-- TODO: There tons of examples of such behaviour, should put them here. -->

The recently introduced multi-threading brings even more problems due to the lack of proper addressing of the data races in the language.
As most of the other design decisions in Crystal, this one has been taken somewhere in Manas without any open discussion.

I've spent two years in the Crystal ecosystem, and it did not moved forward a bit, only backwards (bye, [Serdar](https://twitter.com/sdogruyol), bye [Julien](https://twitter.com/ysbaddaden)).
A brilliant idea is buried by lack of focusing on the community needs.
A hard lesson to learn.
It's time for (_spoiler alert_) Crystal done right.

## Backwards Compatibility

One would now jump into proudly announcing another language they've come up with, an utopia-grade solution to replace both C++ and Rust once and forever.

But the "forever" claim is kinda sloppy.

Remember how I mentioned earlier that backwards compatibility is not _that_ good?
The truth is that there will always be unforeseeable new features at some point, which have to be implemented so a language stays competitive.
For example, coroutines, a term coined in 1958, were not much of interest until 2010's...

A product aiming to preserve backwards compatibility has to somehow insert new features into existing rules without introducing breaking changes.

C++ is a great primer on how not to.
Constrained by existing implementations, they add overly complicated `co_await` functionality into the standard library with auxiliary garbage, which instead should have been built into the language itself (the functionality, not the garbage).

Another ad-hoc example is C++20 concepts.
Instead of allowing to restrict generic arguments in-place, a new `requires` syntax is added, which is quite cumbersome: see [this](https://akrzemi1.wordpress.com/2020/01/29/requires-expression/) and [this](https://akrzemi1.wordpress.com/2020/03/26/requires-clause/).

As the hardware evolves, new fundamental types come into play.
What's the state of support of SIMD vectors, tensors or half-precision floats in C++? Brain floats?
Oh please.
Instead of being incorporated into the standard, implementations come with their own solutions, which further invests into the chaos.

But breaking changes are always painful, you would argue, because on one side you want to use all the shiny new features, but on the other you don't want spend a dime rewriting your code.
It becomes even worse when an open-source library author you're depending on decides that they will not support the older major version of a language; or, instead, they won't move on to the newer version.

Given the amount of open-source libraries your project depends on, you are in trouble, as library versions become stale or incompatible.

All what's left is to visit a library's bugtracker and leave a "what's the status of this?" or "+1" comment, or maybe even put a little bit more effort:

[![I'm sorry for putting my Patreon account link in a MIT-licensed repository 😔](/public/img/posts/2020-08-16-system-programming-in-2k20/are-you-still-there.png "Are you still there??" =100%x)](https://github.com/vladfaust/unity-wakatime/issues/25)

When deciding on which language to built your next big project™ in, what you (or your PM) really want is that it accounts for all the present and future software and hardware features, has ultimate performance, maintainability, and never introduces any breaking changes, so you constantly reap the rich choice of forever-actual libraries.

Of course, such a language should be free as beer, as all of the forever-actual libraries.
What's the point otherwise?

## Rust, pt. 2

Looks like Rust is the perfect candidate.

In the famous [Rust: A Language for the Next 40 Years](https://www.youtube.com/watch?v=A3AdN7U24iU) talk, they say that Rust will never have a major breaking change, staying <s>young</s> version `~> 1` forever, but still evolving.

Wait a minute.

At 32:15, Carol says:

> When I first heard of that idea, I thought it sounds terrible from the compiler maintainance point of view: you have to maintain two ways to use every feature forever, because we wanted to commit to all editions being supported forever. But it's actually not that bad.

Then they take a good thinking sip of water and prove that it is indeed that bad.

[![MFW I realize something's wrong but the slides are already there (clickable)](../../../public/img/posts/2020-08-16-system-programming-in-2k20/carol-knows.png "Carol knows the truth" =100%x)](https://youtu.be/A3AdN7U24iU?t=1822)

Effecitively, the "forever `~> 1`" policy limits the amount of fundamental features Rust MIR can have changed.
According to the talk, only a few keywords are to differ between editions.

So what we have in the dry run is a never-really-changing language with a number of slightly-different dialects to support.
Occasionally, an implementation would opt-out of supporting an edition, and consequentely all the libraries written in this edition become unusable.
No ecosystem split, huh?

The editions problem could be addressed by supporting multiple editions in a single library.
But what if a library author you're depending on decides that they will not support a certain edition...
Um.

> [Ever got that feeling of déjà vu?](https://static.wikia.nocookie.net/overwatch_gamepedia/images/c/c0/Tracer_-_Ever_get_that_feeling_of_d%C3%A9j%C3%A0_vu.ogg){.secret-link}

Yes, we're back to breaking changes and supporting multiple incompatible major <s>versions</s> editions of a language.
Oh those lazy open-source, free, OSI-licensed library maintainer bastards, they are the evil root of all the problems!

## On Open-Source Sustainability

For some, programming is just a job.

For others, programming is a form of an artistic expression.
For artists, writing open-source software facilicates the top two levels of the Maslow's hierarchy: self-actualization and esteem.
They enjoy writing clean, well-documented code, so anyone using it could feel the same.

Guess who creates (a big portion of) quality open-source software?

![Us, the artists!](../../../public/img/posts/2020-08-16-system-programming-in-2k20/it-was-me.jpg =100%x)

The above certainly applies to myself.

I used to maintain a [number](https://github.com/vladfaust?tab=repositories&q=&type=&language=crystal) of Crystal projects, most of which were well-documented and optimally performant.
I enjoyed writing [documentation](http://github.vladfaust.com/mini_redis/index.html) and [compiling changelogs](https://github.com/vladfaust/mini_redis/releases/tag/v0.2.0).
I even enjoyed [replying to issues](https://github.com/vladfaust/unity-wakatime/issues/25), to reveal [unexpected use-cases](https://github.com/vladfaust/migrate.cr/issues/12), [add new features](https://github.com/vladfaust/unity-wakatime/pull/11) and [squash bugs](https://github.com/vladfaust/unity-wakatime/pull/23) together.

The greatest project of mine in Crystal was the [Onyx Framework](https://onyxframework.org), a web framework comprised of a REST server, a database-agnostic SQL ORM and even EDA facilities.
I was planning to also implement a GraphQL framework module, and a convenient CLI to ease the development process.
Objectively, it is more user-friendly, a better balanced between features and usability, than alternatives.

You can find out more about my journey in programming in the [introductory post](/posts/2020-08-07-hello-world/).

### Primitive Needs to Be Ashamed Of

An artist, as any other human, has more needs to satisfy, though.
These are safety and psychological needs.
In other words, a man gotta pay his bills.

Was I able to pay my rent with open-sourcing?

> [LOL, haha!](https://static.wikia.nocookie.net/overwatch_gamepedia/images/a/a4/D.Va_-_Lol.ogg){.secret-link}

Nowadays, a senior iOS developer in Russia has a salary of about $4'000 (300'000₽), which is $25 per hour.

At the best times, my salary as an Open-Source engineer was pathetic $70.

![Earnings BEFORE TAX](/public/img/posts/2020-08-16-system-programming-in-2k20/patreon-income.png "A Patreon income graph with an extremum of $70" =100%x)

I did receive some "tokens of appreciation" from companies a couple of times, but those were not regular and I could certainly not have a decent living even with them.

You may argue that it was my fault to choose a young promising language with sweet syntax and native performance to invest my time into, but read this sentence again.

----

Is it easy to pay your bills when you're a poet?

Poetry is a fundamental form of art, but only a few, from many talented, poets can make their living doing what they love.
Given the same talent level, it takes a big luck to become recognized and earn enough to pay rent.

Some poets may come to streets and start reciting their poetry, hoping for a dime donated.
Some are more than happy to be hired by a children book publishing companiy which needs lots of similar poems...
As the individualism fades away.

<!-- TODO: I can't remember a Javascript repository with brilliant sentences like "if you liked the code, maybe check out my patreon 😂😂😂, but if you want 😂😂😂, sorry 😂😂😂". -->

There is a number of paths for an open-source maintainer:

  1. To spend their time entirely for free.
  1. To spend their time entirely for free, but put a link to their pitiful $0.0002/week Liberapay account, which would inevitably infuriate some Rabadash8820.
  It is also required to always wrap the links with "😂" emojis and constantly [feel bad](https://clips.twitch.tv/RacyImpossibleTubersWTRuck) about asking to compensate your time.
  The fuck?
  1. To sell their time as a software consultant and provide direct support for their libraries.
  These are often sold under the donations sauce and imply the same shameful constraints.
  1. To choose one of the explicit business model paths, such as open-core, where the product is not an open-source anymore, but a real business with marketing, cold calls, email spam, free trials etc.

Regarding to working for free (paths 1 and 2), I love this quote by myself:

> Companies rely on those spending their precious time for free in the hope of being hired by those companies.
> A Saṃsāra's circle to break.

Compared to poetry, the consultancy path (3) is like giving interviews and explaining your poems to others verse-by-verse. Which is not that bad.
Although sometimes you want to spend your time on writing new poems instead of explaining the old ones.
Moreover, some precious time has already been put into an old poem, and shall be compensated as well.
Musicians do not tend to give their already written songs for free, do they?

Regarding to an explicit business path (4), I believe that it has the same consequences for software as for poetry or music.
An artist starts to think about money more than art, which inevitable leads to worse quality.
For example, in the open-core model, a maintainer spends resources on consciously deciding which features are to be deleted from the "open" part, and how to glue them with the paid part.

That being said, are there any other ways to sustain open-source, <mark>to make open-sourcing a _real job_</mark>?

### Source-On-Demand

For musicians, there are platforms like Spotify, where a listener pays a fixed amount of money regularly, and the platform pays a musician based on how popular they were during the period.

Can it be applied to model open-source sustainability?

One of the problems arising is how to determine "popularity" of an open-source library.
Is that the amount of unique downloads ("launches")?
Or maybe some sort of manually-triggered endorsements?

Also, a library may still be useful, but too specific, hence not "popular".
Its maintainance would still require comparable amount of resources.

The solution may be an algorithm taking into consideration both downloads from, say, unique IP addresses, per month, and manual endorsement actions like claps on Medium.
Unfortunately, highly-narrowed, hence unpopular, libraries would still have to look for other sources of funding.

Okay, this looks like a good plan.
But.
In the music world, an artist becoming obsessed with the amount of streams rather than with the quality of their music, either loses its popularity, or changes trends towards <s>shitty</s> lesser-quality music.

![I don't know who is it](../../../public/img/posts/2020-08-16-system-programming-in-2k20/a-famous-mumbler.jpg "A 6ix9ine photo" =100%x)

Could the same thing happen in the open-source world?
Yes.
A greedy (or lucky) programmer may create a ton of `is-even()`-like libraries to be occasionally present as a dependency in a plethora of libraries.
Do they deserve to be rewarded?
Absolutely.
They do create value recognized by dependants, and this shall be propely rewarded.
Does it make overall situation worse?
Yes, because there eventually is a bigger amount of libraries to be aware of and put into dependency lists.
Generally, the more dependencies there is, [the worse](https://blog.carlmjohnson.net/post/2020/avoid-dependencies/).

::: spoiler A classic meme

<div style='position:relative; padding-bottom:calc(55.00% + 44px)'>
  <iframe src='https://gfycat.com/ifr/SmugCautiousFrogmouth' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;'></iframe>
</div>

:::

It is clear that value created by a single `is-even()` library is incomparable to value created by, say, a PostgreSQL driver depending on it.
It would be unfair to award a single "use" of an `is-even()` library equally to the driver "use".
How to clearly determine the value then?

I bet on the number of characters in a library's source code, including those commented (because documentation matters) and in binary files.
As a result, it would be more profitable to release big libraries: a user would likely require only the files they need (making an overall library size irrelevalt to the compilation time), but the algorithm would still count the total amount of lines of code in a library, regardless of which files are required.

One may argue that such a design would encourage Indian-style coding, with lots of repetitions and other crazy practices.
But libraries are normally designed for re-use and continuous maintainance, which means periodically adding new bugs and removing features.
This is not a one-time freelance job.

Even if one decides to go sneaky and publish lots of hardly maintainable code, then, well, they will lose the competition, because they will not be able to maintain the code themselves.

Given a choice, a business shall choose a library whichever is maintained and documented better, and whichever compiles and runs faster.
This is not about music taste getting worse, when a user would continue listening to whatever <s>shitty</s> low-effort product is released. It is about clearly defined business needs, when compile time and runtime cost actual money.

Moreover, when a maintainer has a decent user base paying the bills, hence reputation, they (a maintainer) would take on security [more seriously](https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code/).

<!-- Oh, and manual endorsements should only be made possible from those "paying" customers, so that only actual users of an endorsed library affect its funding. -->

The model seems win-win to me, at least theoretically.
I don't know if it would work in reality, but I guess it's worth trying.

Let's call the model "source-on-demand".

#### Impact On A Language

Let's imagine we've solved the open-source sustainability problem by implementing a source-on-demand service for one language ecosystem.
What benefits would the language experience?

A real market with healthy competition attracts new library authors and incentivizes the old ones to continue maintenance to stay competitive.
That means more libraries in general and less stale issues.

A rich, constantly growing ecosystem attracts new developers, which in turn implement libraries for their own usage, and maybe occasionaly publish them.

<mark>**A healthy competition in the ecosystem frees the language from the backwards compatibility burden.**</mark>
Once it (the language) introduces a breaking change, it's up to library authors to support the new version.
If they decide to drop support for a major language version which is in use, other will likely take the spot.

Wow.
Let's try applying the model to existing languages.

#### A C++ Implementation

_A crazy-looking old man with wild hair steps onto the scene._

Alright kids, now we're about to build a C++ library hosting service with the source-on-demand model.

Where do we begin?
First of all, we need to look at existing solutions.
Okay, Google, `c++ package managers`.
[Here](https://stackoverflow.com/questions/27866965/does-c-have-a-package-manager-like-npm-pip-gem-etc) is the most voted answer on the matter:

> _There seem to be a few though I've never used them._

Well, this is one of the first results a user looking for a C++ package manager stumbles into.
_Not great, not terrible._

Anyway, the only relevant (and alive) projects I could find are [Conan](https://conan.io/), [Buckaroo](https://buckaroo.pm/), [Hunter](https://github.com/cpp-pm/hunter), [VCPKG](https://github.com/Microsoft/vcpkg) and [Pacm](https://sourcey.com/pacm/).
Neither of which is centralized.
They all propose to either set up own package server or download packages directly from sources.

But what about observability?
How does one find C++ packages to use in their projects?
What I if want, for example, an HTTP server package?
My variants are either [Googling](https://lmgtfy.com/?q=c%2B%2B+http+server+library), [GitHubbing](https://github.com/search?q=c%2B%2B+http+library), asking on [Reddit](https://www.reddit.com/r/cpp/comments/cjj9t5/what_c_web_server_library_one_should_use_nowadays/), lurk through manually maintainted [lists of libs](https://en.cppreference.com/w/cpp/links/libs)...
There is definetely a pain to solve!

::: off

While working on this article, I've tried VCPKG, and it's pretty damn good in current stage.
It has its problems like inability to select a compiler on Windows, or select a compiler in principle, which leads to standard compatibility issues.
The latter is more of the loose- C++ -standard issue.

:::

Imagine a shiny new world <s>order</s> with a centralized repository of C++ libraries with good searching features, tags, compatibility information etc!

Would it actually change anything in <s>current government</s> C++?
I doubt so.

C++ is archaic by itself!

Breaking changes to C++ aren't possible even if there was a centralized on-demand library manager solving the library funding problem.
There is no fresh blood in C++, most of the youngsters do not want to bear with poor design the language imposes by itself.
The amount of time needed to convince Stroustrup-aged C++ committee members to push breaking changes into the ISO-governed standard...
I don't think it's feasible by any means.

Old people get older, and C++ software is becoming ancient history.
The new generation is not interested in supporting no legacy code unless well-well-paid.
What is happening with COBOL now is C++'s inevitable future.

C++ is a pile of poor ad-hoc Postel's law-governed design decisions and nomenclature, and it is not able to meet modern world requirements anymore.
<s>Viva la revolución!</s>

----

_The speaker is removed by medics while shouting out revolutionary slogans._
_Another younger-looking gentleman steps onto the scene._

Ahem.
As we can see, there is no point in spending time on implementing a C++ package manager, as it would never be standardized (unless you're a Microsoft), hence widely adopted.
C++ itself would become a history sooner than it happens.
But you, a reader, can try it for yourself.
I don't mind.

Let's move on.

#### A Rust Implementation

Implementing such a service for Rust is totally feasible.
The ([upcoming](http://smallcultfollowing.com/babysteps/blog/2020/01/09/towards-a-rust-foundation/)) Rust Foundation would have total control over crates.io -- the de facto standard Rust package hosting platform.
All they need to do is to implement the Algorithm.

With such a platform implemented, Rust the language would be free to introduce breaking changes.
I'm not sure about whether the editions concept should remain, though.
But anyway.

Even if I, as an individual, manage to implement a crates.io on-demand competitor earlier than the Rust Foundation does, they will inevitably take over, [thanking me](https://keivan.io/the-day-appget-died/) for the beta-test of the idea.
Therefore, there is no motivation for me to spend time on a crates.io competition.

Moreover, I've already stated above why I don't like the Rust language itself.
Convincing Rust maintainers to satisfy my complaints in a an already stabilized language is harder than standardizing a new one.

#### An Implementation

The same applies for Javascript with [recently РЁРёСЂРѕРєР-acquired NPM](https://github.blog/2020-03-16-npm-is-joining-github/) and my desire for a system programming language rather than... Javascript.

Big guys owning existing centralized package distribution platforms might try solving the Open Source sustainability problem with the source-on-demand model.
Until then, no smaller company or individual would dare implementing a competitor, and the suffer continues.

But if I were to implement a new system programming language, I'd then have enough power to experiment with the model.
Plus one point to justifying.

<!-- Is that a monopoly?
May be it is.

EU headquaters are enraged by Facebook acquiring Instagram, but when a single company owns both GitHub and NPM, which effectively covers 80% of the world's software -- that's alright. -->

## On Standardization

Wikipedia does a good job at explaining how [standardization affects technology](https://en.wikipedia.org/wiki/Standardization#Effect_on_technology):

> Increased adoption of a new technology as a result of standardization is important because rival and incompatible approaches competing in the marketplace can slow or even kill the growth of the technology (a state known as market fragmentation).
> The shift to a modularized architecture as a result of standardization brings increased flexibility, rapid introduction of new products, and the ability to more closely meet individual customer's needs.
>
> The negative effects of standardization on technology have to do with its tendency to restrict new technology and innovation.
> Standards shift competition from features to price because the features are defined by the standard.
> The degree to which this is true depends on the specificity of the standard.
> Standardization in an area also rules out alternative technologies as options while encouraging others.

By "standardization" Wikipedia means a tedious ISO-grade standardization process spanned by years.
What I'm proposing instead is <mark>an open specification process driven by the community and businesses</mark>.
With that, a standard remains flexible, and changes to it are shipped frequently.

![A slide from some Onyx presentation](../../../public/img/posts/2020-08-16-system-programming-in-2k20/no-need-no-iso.jpg =100%x)

----

The [lack of need to maintain backwards compatibility](#impact-on-a-language) <mark>allows multiple major versions of a language standard to peacefully co-exist</mark>: more breaking changes are allowed for the language to stay modern.

A language standard presence removes the bus factor when only the ones currently working on the canonical implementation have a deep understanding of the language.

As a result, other implementations may appear, <mark>focusing on their own needs</mark>.
For example, some company may need a compiler for their exotic target.

::: off

Take [Zig](https://ziglang.org/).
Andrew has to work on [supporting many targets](https://ziglang.org/#Wide-range-of-targets-supported) at once.
Instead, he could delegate the implementation job to someone else and focus on the language specification instead.
This would speed up the maturing process.

![At first you be like](../../../public/img/posts/2020-08-16-system-programming-in-2k20/andrew-happy.png =100%x)

![But then you be like](../../../public/img/posts/2020-08-16-system-programming-in-2k20/andrew-sad.png =100%x)

<br>

:::

Apart from standardizing the language itself, its ecosystem shall also be standardized, including package management.
This would <mark>allow competing implementations to remain compatible</mark>, giving a end-user more freedom in choosing of right tooling.

If I _were_ working on a language, standardization would matter more than implementation for me.

## Wrapping up

![Checkpoint!](../../../public/img/posts/2020-08-16-system-programming-in-2k20/checkpoint.svg =100%x)

C++, Rust and others have their [fatal flaws](https://en.wikipedia.org/wiki/Not_invented_here), but I still want to use a higher-level system programming language.

I'm willing to attempt solving the Open-Source Sustainability problem.

Creating a new language and applying the source-on-demand model to its canonical package hosting platform from the very beginning implies a great chance of prosperity for the language and its ecosystem.

Standardization of the language and its ecosystem implies a greater selection of compatible implementations and tooling for the end-user.

With the language's ecosystem being properly funded, the language itself stays flexible, allowing for breaking changes.
A flexible language stays modern, forever.

Worths a shot, doesn't it?

## The New Beginnings

Finally, it's the time to proudly announce another language I've come up with, an utopia-grade solution to replace both C++ and Rust once and forever!

So, what are the goals defined for the new language?

⚠️ **NOTE:** The goals are to be better formulated.

  * Friendliness
    * Infer types and more (e.g. `def foo` and not `def proc foo`)
    * Safe and defined behaviour
    * Allowance for unsafe behaviour compensated with powerful abstraction mechanisms
    * Human-friendly object abstractions (traits, classes);
    math abstractions like in functional programming aren't friendly, but still required in some cases (Onyx has `pure`, for example, and lambdas)
    * But math-like fundamental design where you can infer a rule without the need to always keep it in head, thanks to a set of basic principles
    * Unopinionated, so a user is free to choose the best way that suits their needs.
    Of course, absolute unopinionate is impossible, because there are grammars defined, but it tries to be as much flexible as possible.

  * Performance, so they don't choose another language because it's faster.
  It shall be the final destination.
  System programming and performance tuning things like pointer arithmetics, alignment, fencing, inline assembly, no hidden control flow.

  * Absolute platform agnosticism, but openess to things often present in platforms, i.e. generalization.
  Language is merely a higher-level assembler, no OS is taken into consideration

  * Unix-way of tooling, where can easily replace tooling when needed.
  This implies standardization of the tooling.

  * Foundation for rich libraries: the language shall allow ease of reuse of third-party code

  * Maintainability, so a program can be maintained for longer time.
  This includes problems of inheritance, function overloading etc.
  (solved with traits, for example).

Apart from the language, there are also goals for the ecosystem:

  * Standardization;
  * Funding;

----

Are you ready?

...

_Drum roll intensifies..._ 🥁

...

Meet **Onyx**, the programming language I've been working on for a pretty long time now!

![The language logo, an Onyx-black panther](../../../public/img/onyx-logo.png =60%x)

> Onyx is a general-purpose statically typed programming language suitable both for application and system programming.

Onyx meets all of the goals listed above and even more!
Read more about it in [the Onyx Programming Language](/posts/2020-08-20-the-onyx-programming-language) post.

----

In this article, I've come to a conclusion that the world needs (yet) another system programming language with a solid foundation and funding of its ecosystem, which would potentially solve all the existing problems.

I have formulated the goals for the new language and its ecosystem, and even began working on the implementation, which you can read about more in the [next article](/posts/2020-08-20-the-onyx-programming-language).
