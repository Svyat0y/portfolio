import { Header } from '@/shared/ui/header';
import { Backdrop } from '@/shared/ui/backdrop';
import { sectionOrder } from '@/shared/config';
import { useActiveSection } from '@/shared/lib/hooks';
import { Hero } from '@/sections/hero';
import { About } from '@/sections/about';
import { Skills } from '@/sections/skills';
import { Projects } from '@/sections/projects';
import { Contact } from '@/sections/contact';

export default function App() {
  const { activeSection, goTo } = useActiveSection(sectionOrder);

  return (
    <>
      <Backdrop />
      <Header activeSection={activeSection} onNavigate={goTo} />
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
