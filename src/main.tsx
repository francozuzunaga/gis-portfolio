import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Archive, ArrowUpRight, Database, Download, ExternalLink, FileDown, GitBranch, Layers3, Map, Search } from 'lucide-react';
import { projects } from './projects';
import './styles.css';

const downloadBase = import.meta.env.VITE_DOWNLOAD_BASE_URL ?? '/downloads';

function archiveUrl(archiveName: string) {
  return `${downloadBase.replace(/\/$/, '')}/${archiveName}`;
}

function App() {
  const [query, setQuery] = React.useState('');
  const [format, setFormat] = React.useState('All');

  const formats = React.useMemo(
    () => ['All', ...Array.from(new Set(projects.flatMap((project) => project.formats))).sort()],
    [],
  );

  const visibleProjects = projects.filter((project) => {
    const haystack = `${project.title} ${project.place} ${project.theme} ${project.summary} ${project.formats.join(' ')}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesFormat = format === 'All' || project.formats.includes(format);
    return matchesQuery && matchesFormat;
  });

  const totalQgis = projects.reduce((sum, project) => sum + project.qgisProjects.length, 0);

  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-map" />
        <nav className="topbar" aria-label="Portfolio navigation">
          <a className="brand" href="#page-title">
            <Map size={18} />
            <span>Franco Zuzunaga GIS</span>
          </a>
          <div className="nav-actions">
            <a href="#projects">Projects</a>
            <a href="#downloads">Downloads</a>
            <a className="icon-link" href="https://github.com/" aria-label="GitHub">
              <GitBranch size={18} />
            </a>
          </div>
        </nav>

        <div className="hero-content">
          <p className="kicker">GIS portfolio</p>
          <h1 id="page-title">Spatial projects, class archives, and map-based analysis.</h1>
          <p className="lede">
            A curated collection of QGIS work across planning, transit access, flood exposure, heritage conservation, census workflows, and cartographic styling.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              <Layers3 size={18} />
              View projects
            </a>
            <a className="button secondary" href="#downloads">
              <FileDown size={18} />
              Project ZIPs
            </a>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Collection summary">
        <div>
          <strong>{projects.length}</strong>
          <span>project groups</span>
        </div>
        <div>
          <strong>{totalQgis}</strong>
          <span>QGIS projects</span>
        </div>
        <div>
          <strong>9.8 GB</strong>
          <span>organized source archive</span>
        </div>
        <div>
          <strong>899</strong>
          <span>copied files</span>
        </div>
      </section>

      <section className="workbench" id="projects">
        <div className="section-heading">
          <p className="kicker">Collection</p>
          <h2>Project Index</h2>
        </div>

        <div className="filters" aria-label="Project filters">
          <label className="search">
            <Search size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topic, place, or format"
            />
          </label>
          <div className="format-tabs" role="tablist" aria-label="File format filter">
            {formats.map((item) => (
              <button
                type="button"
                key={item}
                className={item === format ? 'active' : ''}
                onClick={() => setFormat(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="project-grid">
          {visibleProjects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="card-topline">
                <span>{project.place}</span>
                <span>{project.size}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>

              <div className="tag-row" aria-label={`${project.title} formats`}>
                {project.formats.slice(0, 5).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <dl className="meta-list">
                <div>
                  <dt>Theme</dt>
                  <dd>{project.theme}</dd>
                </div>
                <div>
                  <dt>Files</dt>
                  <dd>{project.files.join(', ')}</dd>
                </div>
              </dl>

              <ul className="highlights">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="card-actions">
                <a className="download-link" href={archiveUrl(project.archiveName)}>
                  <Download size={17} />
                  ZIP
                </a>
                <a className="details-link" href={`#${project.id}`}>
                  <ArrowUpRight size={16} />
                  Details
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="downloads" id="downloads">
        <div className="section-heading">
          <p className="kicker">Archives</p>
          <h2>Download Set</h2>
        </div>
        <div className="download-table" role="table" aria-label="GIS project ZIP downloads">
          {projects.map((project) => (
            <div className="download-row" id={project.id} role="row" key={project.id}>
              <div role="cell">
                <Database size={18} />
                <div>
                  <strong>{project.title}</strong>
                  <span>{project.archiveName}</span>
                </div>
              </div>
              <span role="cell">{project.size}</span>
              <a role="cell" href={archiveUrl(project.archiveName)}>
                Download
                <ExternalLink size={15} />
              </a>
            </div>
          ))}
        </div>
        <p className="download-note">
          The deployed site expects ZIP archives at <code>{downloadBase}</code>. For Vercel, use GitHub Releases, object storage, or another external file host for the archives.
        </p>
      </section>

      <footer>
        <Archive size={18} />
        <span>Built with React, Vite, and a faded antique Amsterdam map backdrop.</span>
      </footer>
    </main>
  );
}

declare global {
  interface Window {
    __gisPortfolioRoot?: Root;
  }
}

const container = document.getElementById('root')!;
const root = window.__gisPortfolioRoot ?? createRoot(container);
window.__gisPortfolioRoot = root;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
