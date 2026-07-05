<script>
	import { T, useTask } from '@threlte/core';

	// Group of intersecting translucent forms — an abstract nod to
	// intersectionality. Slow auto-rotation plus a gentle tilt toward the pointer.
	/** @type {any} */
	let group = $state();

	let targetX = 0;
	let targetY = 0;
	let curX = 0;
	let curY = 0;

	/** @param {PointerEvent} e */
	function onPointer(e) {
		targetY = (e.clientX / window.innerWidth - 0.5) * 0.6;
		targetX = (e.clientY / window.innerHeight - 0.5) * 0.4;
	}

	useTask((delta) => {
		if (!group) return;
		curX += (targetX - curX) * Math.min(1, delta * 3);
		curY += (targetY - curY) * Math.min(1, delta * 3);
		group.rotation.y += delta * 0.14;
		group.rotation.x = curX;
		group.rotation.z = curY * 0.4;
	});

	const materialCommon = {
		roughness: 0.12,
		metalness: 0.1,
		transmission: 0.55,
		thickness: 1.2,
		ior: 1.45,
		iridescence: 1,
		iridescenceIOR: 1.6,
		transparent: true,
		opacity: 0.9
	};
</script>

<svelte:window onpointermove={onPointer} />

<T.PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />

<T.AmbientLight intensity={0.5} />
<T.PointLight position={[5, 3, 5]} color="#818cf8" intensity={45} />
<T.PointLight position={[-5, -2, 3]} color="#67e8f9" intensity={32} />
<T.PointLight position={[0, 4, -4]} color="#f0abfc" intensity={30} />
<T.DirectionalLight position={[0, 2, 6]} intensity={0.6} />

<T.Group bind:ref={group} scale={1.05}>
	<T.Mesh rotation={[0.6, 0.2, 0]}>
		<T.TorusGeometry args={[1.7, 0.5, 40, 96]} />
		<T.MeshPhysicalMaterial color="#a78bfa" {...materialCommon} />
	</T.Mesh>

	<T.Mesh rotation={[0.1, 0.9, 0.7]}>
		<T.TorusGeometry args={[2.05, 0.32, 36, 96]} />
		<T.MeshPhysicalMaterial color="#67e8f9" {...materialCommon} />
	</T.Mesh>

	<T.Mesh rotation={[1.25, 0.3, 0.4]}>
		<T.IcosahedronGeometry args={[1.15, 0]} />
		<T.MeshPhysicalMaterial color="#f0abfc" flatShading {...materialCommon} opacity={0.8} />
	</T.Mesh>
</T.Group>
