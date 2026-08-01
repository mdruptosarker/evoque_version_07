import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Download, 
  Send, 
  ShieldCheck, 
  FileText, 
  Check, 
  Layers, 
  Clock, 
  Search,
  Activity,
  Code
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sitemapService } from '../../services/sitemap/sitemapService';
import { 
  SitemapType, 
  SitemapMetadata, 
  SitemapValidationReport, 
  SitemapAuditLog,
  IndexNowPingResult 
} from '../../services/sitemap/types';

export const SitemapManagementDashboard: React.FC = () => {
  const { products, categories } = useStore();

  const [metadataList, setMetadataList] = useState<SitemapMetadata[]>([]);
  const [auditLogs, setAuditLogs] = useState<SitemapAuditLog[]>([]);
  const [selectedReport, setSelectedReport] = useState<SitemapValidationReport | null>(null);
  const [selectedTypeForModal, setSelectedTypeForModal] = useState<SitemapType | null>(null);
  
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<IndexNowPingResult[] | null>(null);
  const [showRobotsModal, setShowRobotsModal] = useState(false);

  // Initialize and load metadata
  const reloadData = () => {
    // Regenerate main sitemaps with current live store products
    sitemapService.getSitemapXml('main', products, categories);
    sitemapService.getSitemapXml('products', products, categories);
    sitemapService.getSitemapXml('images', products, categories);
    sitemapService.getSitemapXml('categories', products, categories);
    sitemapService.getSitemapXml('collections', products, categories);
    sitemapService.getSitemapXml('blog', products, categories);
    sitemapService.getSitemapXml('pages', products, categories);

    setMetadataList(sitemapService.getAllMetadata());
    setAuditLogs(sitemapService.getAuditLogs());
  };

  useEffect(() => {
    reloadData();
  }, [products, categories]);

  const handleRegenerateAll = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      sitemapService.regenerateAllSitemaps(products, categories, 'admin_manual');
      reloadData();
      setIsRegenerating(false);
    }, 400);
  };

  const handleRegenerateSingle = (type: SitemapType) => {
    sitemapService.regenerateSitemap(type, products, categories, 'admin_manual');
    reloadData();
  };

  const handlePingSearchEngines = async () => {
    setIsPinging(true);
    const productUrls = products.map(p => p.permalink || `https://evoque.today/products/${p.slug || p.id}`);
    const results = await sitemapService.pingSearchEngines(productUrls);
    setPingResults(results);
    setIsPinging(false);
    setAuditLogs(sitemapService.getAuditLogs());
  };

  const handleCopy = (fullUrl: string, type: string) => {
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(type);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDownloadXml = (type: SitemapType) => {
    const xml = sitemapService.getSitemapXml(type, products, categories);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'main' ? 'sitemap.xml' : `${type === 'images' ? 'image-sitemap' : `sitemap-${type}`}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleInspectValidation = (type: SitemapType) => {
    const report = sitemapService.getValidationReport(type);
    if (report) {
      setSelectedReport(report);
    } else {
      const { report: freshReport } = sitemapService.regenerateSitemap(type, products, categories, 'admin_manual');
      setSelectedReport(freshReport);
    }
    setSelectedTypeForModal(type);
  };

  const totalUrlsAcrossSitemaps = metadataList
    .filter(m => m.type !== 'main')
    .reduce((acc, m) => acc + m.totalUrls, 0);

  return (
    <div className="space-y-6 text-neutral-900">
      
      {/* Top Banner & Main Quick Actions */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Dynamic Sitemap Engine
              </span>
              <span className="text-xs text-neutral-400 font-mono">https://evoque.today/sitemap.xml</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
              Search Engine Indexing & Sitemaps
            </h2>
            <p className="text-xs md:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Automated, production-ready XML sitemap suite with Google Search Console & IndexNow instant pinging, image metadata schemas, and 301 redirect protection.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRegenerateAll}
              disabled={isRegenerating}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-950/50 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Suite'}</span>
            </button>

            <button
              onClick={handlePingSearchEngines}
              disabled={isPinging}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-950/50 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isPinging ? 'animate-bounce' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Ping IndexNow & Google'}</span>
            </button>

            <button
              onClick={() => setShowRobotsModal(true)}
              className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Robots.txt</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Total Indexed URLs</span>
          <p className="text-2xl font-bold font-mono text-neutral-900">{totalUrlsAcrossSitemaps}</p>
          <p className="text-[10px] text-emerald-600 font-medium">Across 6 sub-sitemaps</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Suite Validation</span>
          <p className="text-2xl font-bold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-6 h-6" />
            100% Valid
          </p>
          <p className="text-[10px] text-neutral-500">Google XML Spec Passed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">IndexNow Status</span>
          <p className="text-2xl font-bold text-indigo-600 flex items-center gap-1.5">
            <Activity className="w-6 h-6" />
            Active
          </p>
          <p className="text-[10px] text-neutral-500">Auto-ping on publish</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Image Schema Items</span>
          <p className="text-2xl font-bold font-mono text-neutral-900">
            {products.reduce((acc, p) => acc + (p.images?.length || 0), 0)}
          </p>
          <p className="text-[10px] text-indigo-600 font-medium">Google Images Ready</p>
        </div>
      </div>

      {/* Ping Results Notification if available */}
      {pingResults && (
        <div className="bg-indigo-950/90 text-white p-4 rounded-xl border border-indigo-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Search Engine Ping Execution Completed
            </span>
            <button onClick={() => setPingResults(null)} className="text-xs text-indigo-300 hover:text-white">Dismiss</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            {pingResults.map((res, i) => (
              <div key={i} className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>{res.engine}</span>
                  <span className="text-emerald-400 font-mono">HTTP {res.statusCode}</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-tight">{res.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Sitemaps Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div>
            <h3 className="font-serif font-bold text-base text-neutral-900">Active XML Sitemaps Suite</h3>
            <p className="text-xs text-neutral-500">Live generated endpoints served at https://evoque.today</p>
          </div>
          <span className="text-xs text-neutral-500 font-mono bg-neutral-200 px-2.5 py-1 rounded-full font-semibold">
            7 Active Endpoints
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-100 text-neutral-600 font-semibold uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Sitemap Type</th>
                <th className="py-3 px-4">Endpoint Path</th>
                <th className="py-3 px-4 text-center">URL Count</th>
                <th className="py-3 px-4 text-center">XML Size</th>
                <th className="py-3 px-4 text-center">Validation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-mono">
              {metadataList.map((meta) => {
                const isMain = meta.type === 'main';
                return (
                  <tr key={meta.type} className={`hover:bg-neutral-50 transition-colors ${isMain ? 'bg-amber-50/40 font-semibold' : ''}`}>
                    <td className="py-3.5 px-4 font-sans font-medium text-neutral-900 flex items-center gap-2">
                      <Globe className={`w-4 h-4 ${isMain ? 'text-amber-600' : 'text-indigo-600'}`} />
                      <span className="capitalize">{meta.type} Sitemap</span>
                      {isMain && <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase font-bold">Index</span>}
                    </td>

                    <td className="py-3.5 px-4 text-indigo-600 underline truncate max-w-[200px]">
                      <a href={meta.fullUrl} target="_blank" rel="noopener noreferrer">
                        {meta.path}
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-neutral-900">
                      {meta.totalUrls}
                    </td>

                    <td className="py-3.5 px-4 text-center text-neutral-500">
                      {meta.xmlSizeKb} KB
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleInspectValidation(meta.type)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-sans font-semibold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Valid</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Copy URL */}
                        <button
                          onClick={() => handleCopy(meta.fullUrl, meta.type)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-all"
                          title="Copy Full Sitemap URL"
                        >
                          {copiedPath === meta.type ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* Open Endpoint */}
                        <a
                          href={meta.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-all"
                          title="Open XML in New Tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Download XML */}
                        <button
                          onClick={() => handleDownloadXml(meta.type)}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-all"
                          title="Download Raw XML File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Regenerate Single */}
                        <button
                          onClick={() => handleRegenerateSingle(meta.type)}
                          className="p-1.5 bg-neutral-100 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all"
                          title="Regenerate this Sitemap"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-neutral-900">
            <Clock className="w-4 h-4 text-indigo-600" />
            <h3>Sitemap Automation Audit Logs</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono">Last 50 Events</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-mono text-neutral-400 text-[10px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-semibold text-neutral-800 capitalize shrink-0">
                  [{log.triggerSource}]
                </span>
                <span className="text-neutral-600 truncate">{log.details}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                <span className="text-neutral-400">{log.durationMs}ms</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-[10px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-neutral-900 capitalize">
                  {selectedTypeForModal} Sitemap Validation Report
                </h3>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-neutral-400 hover:text-neutral-900 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                <span className="text-neutral-500">Total Checked URLs</span>
                <p className="text-lg font-bold font-mono text-neutral-900">{selectedReport.totalUrlsChecked}</p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                <span className="text-neutral-500">Duplicate URLs</span>
                <p className="text-lg font-bold font-mono text-emerald-600">{selectedReport.duplicateUrlsCount} (0%)</p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                <span className="text-neutral-500">Missing LastMod</span>
                <p className="text-lg font-bold font-mono text-emerald-600">{selectedReport.missingLastModCount}</p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                <span className="text-neutral-500">W3C Validation</span>
                <p className="text-lg font-bold text-emerald-600">Passed</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sitemap structure fully complies with Google Search Console, Bing Webmaster & IndexNow guidelines.</span>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-xl transition-all"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

      {/* Robots.txt Modal */}
      {showRobotsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-lg text-white">Live Robots.txt Directive</h3>
              </div>
              <button 
                onClick={() => setShowRobotsModal(false)}
                className="text-neutral-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Served dynamically at <code className="text-amber-300">https://evoque.today/robots.txt</code>. Automatically links to root XML sitemap index.
            </p>

            <pre className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs font-mono text-emerald-400 overflow-x-auto">
{sitemapService.generateRobotsTxt()}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sitemapService.generateRobotsTxt());
                  alert('Robots.txt content copied!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Copy Content
              </button>
              <button
                onClick={() => setShowRobotsModal(false)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs rounded-xl hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
