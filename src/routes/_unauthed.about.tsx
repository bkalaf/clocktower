// src/routes/_unauthed.about.tsx

export const RouteDoc = () => 

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-12 space-y-12">
      {/* Intro */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">About This Project</h1>
        <p className="text-base text-muted-foreground">
          This project is a free and open source tool designed to help people run
          Blood on the Clocktower games online using modern digital tooling. It is
          built to support storytellers and players by making setup, voting, and
          information management fast and painless.
        </p>
        <p className="text-base text-muted-foreground">
          <strong>Eidolon</strong> (noun): an idealized image, apparition, or phantom—
          something that represents an idea more than a physical thing. The name
          reflects the goal of this project: a lightweight digital manifestation of
          the game that preserves the spirit, flow, and social dynamics of playing
          in person.
        </p>
        <p className="text-base text-muted-foreground">
          This project is free and open source and can be found on GitHub. It is not
          affiliated with The Pandemonium Institute. “Blood on the Clocktower” is a
          trademark of Steven Medway and The Pandemonium Institute.
        </p>
      </section>

      {/* Feature Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader>
                <CardTitle>Feature Placeholder</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                A short description of this feature will go here. This is
                placeholder copy and will be replaced later.
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Acknowledgements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Acknowledgements & Copyrights</h2>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>Blood on the Clocktower is a trademark of Steven Medway and The Pandemonium Institute</li>
          <li>Night reminders and other auxiliary text written by Ben Finney</li>
          <li>Iconography by Font Awesome</li>
          <li>Background image copyright and permission granted by Ryan Maloney</li>
          <li>Webfonts by Google Fonts and Online Web Fonts</li>
          <li>All other images and icons are copyright to their respective owners</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          This project and its website are provided free of charge and are not
          affiliated with The Pandemonium Institute in any way.
        </p>
      </section>

      {/* Donations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Donations</h2>
        <p className="text-sm text-muted-foreground">
          This project will always be available free of charge. I build it because
          I enjoy making useful tools and playing Blood on the Clocktower. If you
          still want to support the work, a donation link will live here.
        </p>
        {/* TODO: Add donation link */}
      </section>
    </div>
  );
}
