import { ArrowUpRight, Network } from 'lucide-react'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#top" aria-label="n8n Detleng home"><span className="brand-mark"><Network size={21} /></span><span>n8n <strong>Detleng</strong></span></a>
          <p>A practical learning platform for n8n AI Automation Engineering.</p>
        </div>
        <div className="footer-about">
          <p className="eyebrow">About DeTLeng</p>
          <p>DeTLeng is a collection of practical learning and technology projects created by Muhammad Naveed Ishaque.</p>
          <a className="text-link" href="https://network.detleng.com" target="_blank" rel="noreferrer">Explore DeTLeng Network <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="footer-meta shell">
        <p>Built by Muhammad Naveed Ishaque</p>
        <p>Independent learning project. Not affiliated with or endorsed by n8n GmbH.</p>
      </div>
    </footer>
  )
}
