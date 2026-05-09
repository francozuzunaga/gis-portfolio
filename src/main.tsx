import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ArrowUpRight, Database, Download, ExternalLink, FileDown, GitBranch, Layers3, Map, Search } from 'lucide-react';
import { projects } from './projects';
import './styles.css';

const downloadBase =
  import.meta.env.VITE_DOWNLOAD_BASE_URL ??
  'https://github.com/francozuzunaga/gis-portfolio/releases/download/gis-data';

function archiveUrl(archiveName: string) {
  return `${downloadBase.replace(/\/$/, '')}/${archiveName}`;
}

function archiveNames(projectArchiveName: string | string[]) {
  return Array.isArray(projectArchiveName) ? projectArchiveName : [projectArchiveName];
}

function App() {
  const [query, setQuery] = React.useState('');
  const [format, setFormat] = React.useState('All');

  const formats = React.useMemo(
    () => ['All', ...Array.from(new Set(projects.flatMap((project) => project.formats).filter((item) => item !== 'ZIP'))).sort()],
    [],
  );

  const visibleProjects = projects.filter((project) => {
    const haystack = `${project.title} ${project.place} ${project.theme} ${project.summary} ${project.formats.join(' ')}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesFormat = format === 'All' || project.formats.includes(format);
    return matchesQuery && matchesFormat;
  });

  const previewProjects = projects.filter((project) => project.preview);

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
            <a href="#map-previews">Maps</a>
            <a href="#projects">Projects</a>
            <a href="#downloads">Data</a>
            <a className="icon-link" href="https://github.com/" aria-label="GitHub">
              <GitBranch size={18} />
            </a>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="kicker">GIS portfolio</p>
            <h1 id="page-title">GIS maps and spatial analysis.</h1>
            <p className="lede">
              Cartographic work across transit access, flood exposure, urban morphology, census geography, and heritage planning.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#map-previews">
                <Layers3 size={18} />
                View featured maps
              </a>
              <a className="button secondary" href="#projects">
                <FileDown size={18} />
                Methods index
              </a>
            </div>
          </div>

          <aside className="profile-mark" aria-label="Portfolio author">
            <img src="/profile/meee.jpg" alt="Franco Zuzunaga portrait over a street-map texture" />
            <div>
              <strong>Franco Zuzunaga</strong>
              <span>GIS / spatial analysis</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="stats" aria-label="Collection summary">
        <div>
          <strong>{previewProjects.length}</strong>
          <span>featured maps</span>
        </div>
        <div>
          <strong>{projects.length}</strong>
          <span>spatial studies</span>
        </div>
        <div>
          <strong>7</strong>
          <span>regional contexts</span>
        </div>
        <div>
          <strong>QGIS</strong>
          <span>analysis environment</span>
        </div>
      </section>

      <section className="map-previews" id="map-previews">
        <div className="section-heading">
          <p className="kicker">Featured Maps</p>
          <h2>Map Gallery</h2>
        </div>
        <div className="preview-stack">
          {previewProjects.map((project) => (
            <article className="preview-panel" id={`preview-${project.id}`} key={project.id}>
              <div className="preview-copy">
                <span>{project.place}</span>
                <h3>{project.preview!.title}</h3>
                <p>{project.preview!.caption}</p>
                <a href={archiveUrl(archiveNames(project.archiveName)[0])}>
                  View source data
                  <ExternalLink size={15} />
                </a>
              </div>
              <figure>
                <img src={project.preview!.image} alt={`${project.preview!.title} with map legend`} />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="workbench" id="projects">
        <div className="section-heading">
          <p className="kicker">Portfolio Index</p>
          <h2>Spatial Studies</h2>
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
                <span>{project.theme}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              {project.preview && (
                <a className="card-preview" href={`#preview-${project.id}`} aria-label={`View ${project.preview.title} map preview`}>
                  <img src={project.preview.image} alt={`${project.preview.title} map preview`} />
                </a>
              )}

              <div className="tag-row" aria-label={`${project.title} formats`}>
                {project.formats.filter((item) => item !== 'ZIP').slice(0, 5).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>

              <dl className="meta-list">
                <div>
                  <dt>Theme</dt>
                  <dd>{project.theme}</dd>
                </div>
                <div>
                  <dt>Inputs</dt>
                  <dd>{project.files.join(', ')}</dd>
                </div>
              </dl>

              <ul className="highlights">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="card-actions">
                <a className="download-link" href={archiveUrl(archiveNames(project.archiveName)[0])}>
                  <Download size={17} />
                  Data
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
          <p className="kicker">Data</p>
          <h2>Data Access</h2>
        </div>
        <div className="download-table" role="table" aria-label="GIS source data downloads">
          {projects.flatMap((project) =>
            archiveNames(project.archiveName).map((archiveName, index) => (
              <div className="download-row" id={index === 0 ? project.id : undefined} role="row" key={`${project.id}-${archiveName}`}>
                <div role="cell">
                  <Database size={18} />
                  <div>
                    <strong>{project.title}{archiveNames(project.archiveName).length > 1 ? `, data part ${index + 1}` : ''}</strong>
                    <span>{project.theme}</span>
                  </div>
                </div>
                <a role="cell" href={archiveUrl(archiveName)}>
                  Source data
                  <ExternalLink size={15} />
                </a>
              </div>
            )),
          )}
        </div>
        <p className="download-note">
          Supporting datasets and project files are kept separate from the visual portfolio.
        </p>
      </section>

      <footer>
        <Map size={18} />
        <span>Franco Zuzunaga GIS portfolio.</span>
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
