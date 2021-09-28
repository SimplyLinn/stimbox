import React from 'react';
import Page from 'stimbox/Components/Layout/Page';

export default function About(): JSX.Element {
  return (
    <Page title="What is Stimbox?">
      <p>
        Stimbox is a repository for small browser based toys, stimboxes, made to
        engage your brain when you need something to focus on, but not take up
        mental resources so you end up drained from mental exhaustion. To let
        you find something to stim with and to collect multiple small webtoys in
        one place.
      </p>
      <h2>What is stim/stimming?</h2>
      <p>
        Stimming is autism (it&apos;s also used in broader neurodiversity
        contexts) lingo. It&apos;s short for “stimuli” or “stimulating”. People
        most commonly refers to physical stimming, touching certain textures,
        doing things with your hands, or similar, but there&apos;s also visual
        stims and auditory stims. Getting absorbed certain
        colors/shapes/patters, and just enjoying certain sounds.
      </p>
      <h2>
        Wait, it&apos;s an autism thing? I&apos;m not autistic. Should I even be
        here?
      </h2>
      <p>
        If you like what you see, sure? Even though this was written from a
        viewpoint of an autistic person making toys to help herself and her
        autistic peers, and hence why I&apos;m using this language, in
        neurotypical terms, what&apos;s on this site is just a collection of
        small silly toys, similar to a fidget spinner, or a stress-ball. See
        this as a collection of virtual stress balls.
      </p>
    </Page>
  );
}
