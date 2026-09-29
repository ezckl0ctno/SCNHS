import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, o as descriptorFromVideo, s as loadFaceEngine } from "./app-shell-bktvxgIj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/face-capture-CVUwv37R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FaceCapture({ onCapture, variant = "dark" }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [hint, setHint] = (0, import_react.useState)("Starting camera…");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				await loadFaceEngine();
				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: "user",
						width: { ideal: 640 },
						height: { ideal: 480 }
					},
					audio: false
				});
				if (cancelled) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play();
				}
				setReady(true);
				setHint("Face the camera, then capture.");
			} catch {
				setHint("Camera is not available here. Use PIN at the gate instead.");
			}
		})();
		return () => {
			cancelled = true;
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, []);
	async function capture() {
		if (!videoRef.current) return;
		setHint("Looking for a face…");
		const descriptor = await descriptorFromVideo(videoRef.current);
		if (!descriptor) {
			setHint("No face found. Come closer, even light, look straight.");
			return;
		}
		onCapture(descriptor);
		setHint("Face captured.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl bg-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					ref: videoRef,
					className: "aspect-[4/3] w-full object-cover",
					muted: true,
					playsInline: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: variant === "dark" ? "text-sm text-leaf" : "text-sm text-muted",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: variant === "dark" ? "gold" : "primary",
				disabled: !ready,
				onClick: capture,
				children: "Capture face"
			})
		]
	});
}
//#endregion
export { FaceCapture as t };
