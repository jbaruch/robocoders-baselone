const els = {
  cameraSelect: document.getElementById('cameraSelect'),
  video: document.getElementById('video'),
  swatch: document.getElementById('colorSwatch'),
  sendBtn: document.getElementById('sendBtn'),
  autoToggle: document.getElementById('autoToggle'),
  messages: document.getElementById('messages'),
};

const LS_KEYS = {
  cameraId: 'rgbw.cameraDeviceId',
  auto: 'rgbw.autoMode',
};

let stream = null;
let sampleTimer = null;
let autoTimer = null;
let currentColor = { r: 0, g: 0, b: 0, w: 0 };

function msg(text, kind = 'info') {
  const div = document.createElement('div');
  div.className = `msg ${kind}`;
  div.textContent = text;
  els.messages.prepend(div);
  setTimeout(() => div.remove(), 5000);
}

async function listCameras() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    msg('enumerateDevices() not supported in this browser', 'error');
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(d => d.kind === 'videoinput');
  } catch (err) {
    msg(`${err.name}: ${err.message}`, 'error');
    return [];
  }
}

function populateCameraSelect(devices, savedId) {
  els.cameraSelect.innerHTML = '';
  devices.forEach((d, idx) => {
    const opt = document.createElement('option');
    opt.value = d.deviceId;
    opt.textContent = d.label || `Camera ${idx + 1}`;
    if (savedId && d.deviceId === savedId) opt.selected = true;
    els.cameraSelect.appendChild(opt);
  });
}

async function startStream(deviceId) {
  stopStream();
  try {
    const constraints = deviceId ? { video: { deviceId: { exact: deviceId } } } : { video: true };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    els.video.srcObject = stream;
    // After permission, device labels become available; refresh list for nicer labels.
    const cams = await listCameras();
    populateCameraSelect(cams, deviceId);
  } catch (err) {
    msg(`Camera error: ${err.name} ${err.message}`, 'error');
  }
}

function stopStream() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
}

function startSampling() {
  stopSampling();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  sampleTimer = setInterval(() => {
    const video = els.video;
    if (!video.videoWidth || !video.videoHeight) return;
    const w = 64; // downscale for speed
    const h = Math.round((video.videoHeight / video.videoWidth) * w);
    canvas.width = w; canvas.height = h;
    try {
      ctx.drawImage(video, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const { r, g, b } = averageRGB(img.data);
      currentColor = { r, g, b, w: 0 };
      els.swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    } catch (e) {
      // getImageData can throw if canvas tainted; ignore single frame
    }
  }, 100);
}

function stopSampling() {
  if (sampleTimer) clearInterval(sampleTimer);
  sampleTimer = null;
}

function averageRGB(data) {
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  if (count === 0) return { r: 0, g: 0, b: 0 };
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count),
  };
}

async function sendColor() {
  const body = JSON.stringify(currentColor);
  try {
    const res = await fetch('/api/color', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      msg(`Sent color rgbw(${currentColor.r},${currentColor.g},${currentColor.b},${currentColor.w})`, 'ok');
    } else if (res.status === 503) {
      msg(json.message || 'Bulb IP not configured. Set shelly.ip or SHELLY_IP.', 'error');
    } else if (res.status === 400) {
      msg(json.message || 'Invalid color payload', 'error');
    } else {
      msg(json.message || `Network error (${res.status})`, 'error');
    }
  } catch (e) {
    msg(`Fetch failed: ${e.message}`, 'error');
  }
}

function startAuto() {
  stopAuto();
  autoTimer = setInterval(sendColor, 3000);
}

function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

function restoreState() {
  const savedId = localStorage.getItem(LS_KEYS.cameraId);
  const auto = localStorage.getItem(LS_KEYS.auto) === 'true';
  if (auto) {
    els.autoToggle.checked = true;
    startAuto();
  }
  return { savedId, auto };
}

function handleVisibility() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !stream) {
      startStream(els.cameraSelect.value).then(() => startSampling());
    }
  });
}

async function init() {
  if (!navigator.mediaDevices?.getUserMedia) {
    msg('getUserMedia() not supported. Try a modern browser.', 'error');
    return;
  }
  const { savedId } = restoreState();
  await startStream(savedId);
  startSampling();

  els.cameraSelect.addEventListener('change', async (e) => {
    const id = e.target.value;
    localStorage.setItem(LS_KEYS.cameraId, id);
    await startStream(id);
  });

  els.sendBtn.addEventListener('click', sendColor);

  els.autoToggle.addEventListener('change', (e) => {
    const on = e.target.checked;
    localStorage.setItem(LS_KEYS.auto, String(on));
    if (on) startAuto(); else stopAuto();
  });

  handleVisibility();
}

document.addEventListener('DOMContentLoaded', init);
