document.addEventListener('DOMContentLoaded', () => {
    Preloader.init();
    CustomCursor.init();
    Navbar.init();
    ThreeDScenes.init();
    CardInteractions.init();
    ScrollAnimations.init();
    WorkflowAnimation.init();
    TransformationEffect.init();
    ContactForm.init();
    PageTransitions.init();
});

const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        if (preloader) setTimeout(() => { preloader.classList.add('hidden'); document.body.style.overflow = ''; }, 2000);
    }
};

const CustomCursor = {
    init() {
        if (window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window)) {
            document.body.classList.add('cursor-default');
            return;
        }
        const cursor = document.querySelector('.custom-cursor');
        const cursorDot = document.querySelector('.custom-cursor-dot');
        if (!cursor || !cursorDot) return;
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
        document.querySelectorAll('a, button, .card-3d, .service-full-card, .industry-card, .workflow-node, .case-study-node').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
            requestAnimationFrame(animate);
        };
        animate();
    }
};

const Navbar = {
    init() {
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.navbar-nav');
        if (!navbar) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                nav.classList.toggle('active');
            });
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                });
            });
        }
    }
};

const ThreeDScenes = {
    init() {
        this.initHeroScene();
        this.initAboutScene();
        this.initContactScene();
    },
    initHeroScene() {
        const container = document.getElementById('hero-canvas');
        if (!container || typeof THREE === 'undefined') return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const orbGeometry = new THREE.SphereGeometry(1.5, 64, 64);
        const orbMaterial = new THREE.MeshPhongMaterial({ color: 0x3371ff, emissive: 0x112244, specular: 0xffffff, shininess: 100, transparent: true, opacity: 0.9 });
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        scene.add(orb);
        const innerGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const innerMaterial = new THREE.MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.5 });
        const innerGlow = new THREE.Mesh(innerGeometry, innerMaterial);
        scene.add(innerGlow);
        const nodes = [];
        const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x5ed7ff });
        for (let i = 0; i < 50; i++) {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
            node.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01);
            nodes.push(node);
            scene.add(node);
        }
        scene.add(new THREE.AmbientLight(0x404040, 2));
        const pointLight = new THREE.PointLight(0x3371ff, 2, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        const pointLight2 = new THREE.PointLight(0x7c5cff, 2, 100);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);
        camera.position.z = 5;
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', e => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        const animate = () => {
            requestAnimationFrame(animate);
            orb.rotation.y += 0.002 + mouseX * 0.01;
            orb.rotation.x += 0.001 + mouseY * 0.01;
            innerGlow.rotation.y -= 0.003;
            nodes.forEach(node => {
                node.position.add(node.velocity);
                if (Math.abs(node.position.x) > 4) node.velocity.x *= -1;
                if (Math.abs(node.position.y) > 4) node.velocity.y *= -1;
                if (Math.abs(node.position.z) > 4) node.velocity.z *= -1;
            });
            renderer.render(scene, camera);
        };
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    },
    initAboutScene() {
        const container = document.getElementById('about-canvas');
        if (!container || typeof THREE === 'undefined') return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const group = new THREE.Group();
        const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x3371ff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        group.add(cube);
        const wireGeometry = new THREE.EdgesGeometry(cubeGeometry);
        const wireMaterial = new THREE.LineBasicMaterial({ color: 0x5ed7ff });
        const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
        group.add(wireframe);
        const particles = [];
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x7c5cff });
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            const angle = (i / 20) * Math.PI * 2;
            particle.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 1.25, Math.sin(angle) * 0.75);
            particle.angle = angle;
            particle.radius = 2.5;
            particles.push(particle);
            group.add(particle);
        }
        scene.add(group);
        scene.add(new THREE.AmbientLight(0x404040, 2));
        const pointLight = new THREE.PointLight(0x3371ff, 2, 100);
        pointLight.position.set(3, 3, 3);
        scene.add(pointLight);
        camera.position.z = 5;
        const animate = () => {
            requestAnimationFrame(animate);
            group.rotation.y += 0.005;
            group.rotation.x += 0.002;
            particles.forEach(particle => {
                particle.angle += 0.01;
                particle.position.x = Math.cos(particle.angle) * particle.radius;
                particle.position.y = Math.sin(particle.angle) * particle.radius * 0.5;
            });
            renderer.render(scene, camera);
        };
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    },
    initContactScene() {
        const container = document.getElementById('contact-canvas');
        if (!container || typeof THREE === 'undefined') return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const nodes = [];
        const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x3371ff });
        const positions = [{x:-2,y:1,z:0},{x:0,y:1.5,z:0},{x:2,y:1,z:0},{x:-1,y:-1,z:0},{x:1,y:-1,z:0}];
        positions.forEach(pos => {
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(pos.x, pos.y, pos.z);
            nodes.push(node);
            scene.add(node);
        });
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x5ed7ff, transparent: true, opacity: 0.5 });
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const geometry = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
                scene.add(new THREE.Line(geometry, lineMaterial));
            }
        }
        const particles = [];
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x7c5cff });
        for (let i = 0; i < 30; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*2);
            particle.velocity = new THREE.Vector3((Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02, 0);
            particles.push(particle);
            scene.add(particle);
        }
        scene.add(new THREE.AmbientLight(0x404040, 2));
        camera.position.z = 4;
        const animate = () => {
            requestAnimationFrame(animate);
            nodes.forEach((node, i) => {
                const scale = 1 + Math.sin(Date.now() * 0.002 + i) * 0.1;
                node.scale.set(scale, scale, scale);
            });
            particles.forEach(particle => {
                particle.position.add(particle.velocity);
                if (Math.abs(particle.position.x) > 2.5) particle.velocity.x *= -1;
                if (Math.abs(particle.position.y) > 2.5) particle.velocity.y *= -1;
            });
            renderer.render(scene, camera);
        };
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }
};

const CardInteractions = {
    init() {
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left, y = e.clientY - rect.top;
                const rotateX = (y - rect.height/2) / 10, rotateY = (rect.width/2 - x) / 10;
                card.style.setProperty('--mouse-x', ((x / rect.width) * 100) + '%');
                card.style.setProperty('--mouse-y', ((y / rect.height) * 100) + '%');
                card.style.transform = 'perspective(1000px) rotateX(' + (-rotateX) + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'; });
        });
        document.querySelectorAll('.service-full-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
                card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
            });
        });
        document.querySelectorAll('.industry-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const rotateX = (e.clientY - rect.top - rect.height/2) / 15;
                const rotateY = (rect.width/2 - (e.clientX - rect.left)) / 15;
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });
            card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; });
        });
    }
};

const ScrollAnimations = {
    init() {
        if (typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        gsap.utils.toArray('.reveal').forEach(el => {
            gsap.to(el, { scrollTrigger: { trigger: el, start: 'top 85%', toggleClass: 'active' }, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        });
        gsap.utils.toArray('.cards-grid, .services-preview-grid, .industries-grid, .why-us-grid').forEach(grid => {
            gsap.from(grid.children, { scrollTrigger: { trigger: grid, start: 'top 80%' }, opacity: 0, y: 50, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
        });
        gsap.utils.toArray('.section-header h2').forEach(header => {
            gsap.from(header, { scrollTrigger: { trigger: header, start: 'top 85%' }, opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' });
        });
    }
};

const WorkflowAnimation = {
    init() {
        const workflowSection = document.querySelector('.workflow-container');
        if (!workflowSection || typeof gsap === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        const line = document.querySelector('.workflow-line-animated');
        if (line) gsap.to(line, { scrollTrigger: { trigger: workflowSection, start: 'top 70%', scrub: 1 }, width: '100%', ease: 'power2.inOut' });
        gsap.from(document.querySelectorAll('.workflow-node'), { scrollTrigger: { trigger: workflowSection, start: 'top 75%' }, opacity: 0, scale: 0.5, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' });
    }
};

const TransformationEffect = {
    init() {
        const btn = document.querySelector('.transform-btn');
        if (!btn) return;
        const beforePanel = document.querySelector('.transformation-panel.before');
        const afterPanel = document.querySelector('.transformation-panel.after');
        btn.addEventListener('click', () => {
            beforePanel.style.opacity = '0.4';
            btn.style.background = 'linear-gradient(135deg, #2ed573, #1e90ff)';
            btn.innerHTML = '<span>✓</span>Activated';
            setTimeout(() => { afterPanel.style.opacity = '1'; }, 500);
            btn.disabled = true;
            btn.style.cursor = 'default';
        });
    }
};

const ContactForm = {
    init() {
        const form = document.querySelector('.contact-form form');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            const submitBtn = form.querySelector('.form-submit');
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            setTimeout(() => {
                form.style.display = 'none';
                const successMsg = document.querySelector('.form-success');
                if (successMsg) successMsg.classList.add('show');
            }, 1500);
        });
    }
};

const PageTransitions = {
    init() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => { document.body.style.opacity = '1'; }, 100);
        document.querySelectorAll('a[href^="."], a[href^="/"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && !href.includes('#') && !href.startsWith('http')) {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    document.body.style.opacity = '0';
                    setTimeout(() => { window.location.href = href; }, 500);
                });
            }
        });
    }
};

document.addEventListener('click', e => {
    const nav = document.querySelector('.navbar-nav');
    const hamburger = document.querySelector('.hamburger');
    if (nav && hamburger && !nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

console.log('AI Automation Website initialized! 🚀');
