/**
 * Verilog Quest 2026 - Network IP & Fraud Prevention Intelligence
 * Discovers and monitors client IP addresses, ISP network provenance, and multi-IP anomalies.
 */

let cachedIpData = null;

export const fetchClientIpData = async () => {
  if (cachedIpData) return cachedIpData;

  // 1. Check sessionStorage cache
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('vq_client_ip_data');
    if (saved) {
      try {
        cachedIpData = JSON.parse(saved);
        return cachedIpData;
      } catch {}
    }
  }

  // 2. Fetch live public IP from public HTTPS endpoint
  try {
    const res = await fetch('https://api.ipify.org?format=json', { 
      signal: AbortSignal.timeout(3000) 
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        let org = 'High-Speed Broadband / Campus Network';
        try {
          const detailRes = await fetch(`https://ipapi.co/${data.ip}/json/`, {
            signal: AbortSignal.timeout(2000)
          });
          if (detailRes.ok) {
            const detail = await detailRes.json();
            const loc = [detail.city, detail.region].filter(Boolean).join(', ');
            org = loc ? `${loc} (${detail.org || 'ISP'})` : (detail.org || org);
          }
        } catch {
          // secondary detail lookup fallback
        }

        cachedIpData = {
          ip: data.ip,
          org,
          timestamp: Date.now()
        };

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vq_client_ip_data', JSON.stringify(cachedIpData));
        }
        return cachedIpData;
      }
    }
  } catch (err) {
    // network timeout or isolated LAN
  }

  // 3. Deterministic Campus Fallback for LAN/offline testing (NITK Surathkal ERNET IP Subnet)
  let seed = 'local';
  if (typeof window !== 'undefined') {
    seed = localStorage.getItem('vq_device_id') || 'dev_local';
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const host = Math.abs(hash % 240) + 10;
  const fallbackIp = `14.139.155.${host}`;
  const fallbackOrg = 'NITK Surathkal / National Knowledge Network (NKN)';

  cachedIpData = {
    ip: fallbackIp,
    org: fallbackOrg,
    timestamp: Date.now()
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('vq_client_ip_data', JSON.stringify(cachedIpData));
  }
  return cachedIpData;
};

export const getCachedClientIp = () => {
  if (cachedIpData && cachedIpData.ip) return cachedIpData.ip;
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('vq_client_ip_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        cachedIpData = parsed;
        return parsed.ip;
      } catch {}
    }
  }
  return '14.139.155.82';
};

export const getCachedNetworkOrg = () => {
  if (cachedIpData && cachedIpData.org) return cachedIpData.org;
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('vq_client_ip_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        cachedIpData = parsed;
        return parsed.org;
      } catch {}
    }
  }
  return 'NITK Surathkal / National Knowledge Network (NKN)';
};
