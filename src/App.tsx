import { Header } from '@/shared/ui/header';
import { Backdrop } from '@/shared/ui/backdrop';
import { Hero } from '@/sections/hero';
import { About } from '@/sections/about';
import { Skills } from '@/sections/skills';
import { Projects } from '@/sections/projects';
import { Contact } from '@/sections/contact';

export default function App() {
  return (
    <>
      <Backdrop />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
