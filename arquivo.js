        (function initDemo3D() {
            const container = document.getElementById('demo-canvas-container');
            if(!container) return;

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87ceeb);

            const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
            camera.position.set(0, 8, 12);

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // Luzes
            const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
            scene.add(light);
            const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
            dirLight.position.set(10, 20, 10);
            scene.add(dirLight);

            // Chão
            const floorGeo = new THREE.PlaneGeometry(60, 60);
            const floorMat = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.rotation.x = -Math.PI / 2;
            scene.add(floor);

            // Árvores simples
            function addTree(x, z) {
                const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.2, 8);
                const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
                const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                trunk.position.set(x, 0.6, z);

                const leavesGeo = new THREE.ConeGeometry(1, 2, 8);
                const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
                const leaves = new THREE.Mesh(leavesGeo, leavesMat);
                leaves.position.set(x, 2, z);

                scene.add(trunk);
                scene.add(leaves);
            }

            addTree(5, -5);
            addTree(-8, -10);
            addTree(12, 8);
            addTree(-10, 6);

            // Personagem (Cubo Representativo)
            const playerGeo = new THREE.BoxGeometry(1, 1.5, 1);
            const playerMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5 });
            const player = new THREE.Mesh(playerGeo, playerMat);
            player.position.y = 0.75;
            scene.add(player);

            // Controles
            const keys = {};
            window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
            window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

            const clock = new THREE.Clock();

            function animate() {
                requestAnimationFrame(animate);
                const delta = clock.getDelta();
                const speed = 7;

                let moveX = 0;
                let moveZ = 0;

                if (keys['w'] || keys['arrowup']) moveZ -= 1;
                if (keys['s'] || keys['arrowdown']) moveZ += 1;
                if (keys['a'] || keys['arrowleft']) moveX -= 1;
                if (keys['d'] || keys['arrowright']) moveX += 1;

                if (moveX !== 0 || moveZ !== 0) {
                    const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
                    moveX /= len;
                    moveZ /= len;

                    player.position.x += moveX * speed * delta;
                    player.position.z += moveZ * speed * delta;

                    // Limites
                    player.position.x = Math.max(-25, Math.min(25, player.position.x));
                    player.position.z = Math.max(-25, Math.min(25, player.position.z));

                    player.rotation.y = Math.atan2(moveX, moveZ);
                }

                // Câmera Suave
                camera.position.x = player.position.x;
                camera.position.z = player.position.z + 10;
                camera.lookAt(player.position);

                renderer.render(scene, camera);
            }

            animate();

            window.addEventListener('resize', () => {
                if(!container) return;
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        })();