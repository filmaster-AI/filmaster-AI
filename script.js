document.addEventListener('DOMContentLoaded', () => {
    // --- 处理Logo点击，平滑滚动回顶部 ---

    // 1. 获取Logo链接元素
    const logoLink = document.getElementById('logo-link-to-top');

    // 2. 确保元素存在
    if (logoLink) {
        // 3. 为它添加点击事件监听器
        logoLink.addEventListener('click', (event) => {
            // a. 阻止链接的默认跳转行为
            event.preventDefault();

            // b. 使用window.scrollTo平滑滚动到页面顶部
            window.scrollTo({
                top: 0, // 0 表示页面的最顶部
                behavior: 'smooth' // 这是实现平滑滚动的关键
            });
        });
    }

    // --- Feedback Modal Logic ---
    const openBtn = document.getElementById('open-feedback-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('feedback-modal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    // 点击遮罩层关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });


    // Parallax effect for the hero section background
    const heroBg = document.querySelector('#hero .hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    //居中跳转
    const HEADER_HEIGHT = 100; // <-- 在这里修改为你导航栏的实际高度

    // ==========================================
    //  脚本逻辑
    // ==========================================
    
    // 选择所有 href 以 '#' 开头的链接
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

    allAnchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止所有默认跳转

            const targetId = this.getAttribute('href');
            // 确保我们能找到目标元素，并且它不是一个空的'#'链接
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    let scrollPosition;
                    
                    // 判断链接是否需要“居中跳转”
                    if (this.classList.contains('jump-to-center')) {
                        // --- 居中跳转逻辑 ---
                        const elementTop = targetElement.offsetTop;
                        const elementHeight = targetElement.offsetHeight;
                        const windowHeight = window.innerHeight;
                        scrollPosition = elementTop + (elementHeight / 2) - (windowHeight / 2);
                    } else {
                        // --- 顶部偏移跳转逻辑 ---
                        const elementTop = targetElement.offsetTop;
                        scrollPosition = elementTop - HEADER_HEIGHT;
                    }
                    
                    // 平滑滚动到计算出的位置
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Tab functionality
    const tabContainers = document.querySelectorAll('#part-c-content, #part-d-content, #part-e-content, #part-f-content');
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tabs-nav .tab-btn');
        const tabContents = container.querySelectorAll('.cards-container'); // Assuming each tab controls a cards-container directly or indirectly

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Deactivate all buttons in this container
                tabButtons.forEach(btn => btn.classList.remove('active'));
                // Activate the clicked button
                button.classList.add('active');

                // Hide all tab content sections in this container
                // This assumes a direct relationship or specific structure for content switching.
                // For this example, we'll assume the content to show/hide needs specific IDs or classes tied to tabs.
                // This part might need refinement based on how tab content is structured in HTML.
                // For instance, if each tab controls a unique section within the cards-container or a sibling section.
                console.log(`Tab ${index + 1} clicked in container: ${container.id}`);
                // Example: if tabContents[index] exists and should be shown
                // tabContents.forEach(content => content.style.display = 'none');
                // if(tabContents[index]) tabContents[index].style.display = 'flex'; // or 'block' depending on layout
            });
        });
    });

    // Placeholder for other animations or interactive elements based on Figma
    // For example, revealing elements on scroll, handling button clicks for "Learn more", "Continue" etc.

    // Example: Animate elements on scroll (Intersection Observer API)
    const animatedElements = document.querySelectorAll('.hero-content h1, .hero-text-content h2, .hero-text-content p, .learn-more-btn, #about .about-image, #about .about-content');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // observer.unobserve(entry.target); // Optional: stop observing after animation
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

    animatedElements.forEach(el => {
        el.style.opacity = '0'; // Start as invisible
        el.style.transform = 'translateY(20px)'; // Start slightly offset
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });





    /**
     * 为视频元素设置 Intersection Observer，以实现进入视口播放，离开视口暂停的功能。
     * @param {string} videoId - 视频元素的 ID。
     * @param {boolean} playWithSound - 是否尝试带声音播放。
     */
    const setupIntersectionObserverForVideo = (videoId, playWithSound = false) => {
        const videoElement = document.getElementById(videoId);
        if (!videoElement) {
            console.warn(`Video element with ID "${videoId}" not found.`);
            return;
        }

        // 移除 muted 属性如果需要带声音播放
        if (playWithSound) {
            videoElement.muted = false;
        } else {
            videoElement.muted = true; // 确保静音，以便自动播放更可靠
        }

        const playVideo = async () => {
            try {
                await videoElement.play();
            } catch (error) {
                console.error(`Error playing video "${videoId}":`, error);
                // 如果是带声音播放失败，可以给用户提示
                if (playWithSound) {
                     alert("浏览器可能阻止了视频自动播放声音。请尝试手动点击播放。");
                }
            }
        };

        const pauseVideo = () => {
            videoElement.pause();
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // 50% 可见时触发
        };

        const intersectionCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    playVideo();
                } else {
                    pauseVideo();
                }
            });
        };

        const observer = new IntersectionObserver(intersectionCallback, observerOptions);
        observer.observe(videoElement);
    };

    // --- 现在应用这个函数到你的所有视频上 ---

    // 1. 应用到哥斯拉视频，并尝试带声音播放
    setupIntersectionObserverForVideo('gozilla-output-video', true); //true with audio, false without audio

    // 2. 应用到小王子卡片视频，静音播放 (推荐用于背景/卡片视频)
    setupIntersectionObserverForVideo('card-video-little-prince', false);
    
    // 3. 如果还有其他视频，比如 #about-video，也可以应用
    setupIntersectionObserverForVideo('card-video-insideout', false); 

    // 4. 如果还有其他视频，比如 #about-video，也可以应用
    // setupIntersectionObserverForVideo('card-video-nemo_octopus', true); 

    // 5. 如果还有其他视频，比如 #about-video，也可以应用
    setupIntersectionObserverForVideo('card-video-man_footstep', false); 

    


    // ==================================================
    //      #about Section Auto-Scroll Snap Animation
    // ==================================================
    const aboutSectionToSnap = document.getElementById('about');

    if (aboutSectionToSnap) {
        // 防止与 hero/about 元素上已有的淡入动画冲突，给一个新变量名
        const snapObserver = new IntersectionObserver((entries, observer) => {
            const [entry] = entries;
            
            // 检查元素是否进入视口，并且页面当前没有在由用户控制的滚动中
            // (这是一个小优化，避免在快速滚动时触发)
            if (entry.isIntersecting) {
                
                // 执行平滑滚动，将区域滚动到视口中央
                entry.target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // 重要：一旦触发过一次，就停止观察此元素
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.2 // 当目标区域的 25% 进入视口时触发 TODO
        });

        // 开始观察目标区域
        snapObserver.observe(aboutSectionToSnap);
    }



    // example button to gozilla output section
    // --- CODE FOR "EXAMPLE" BUTTON AND "BACK" BUTTON SCROLLING ---

    const aboutSection = document.getElementById('about');
    // Find the "Example" button within the #about section specifically
    const exampleButton = aboutSection ? aboutSection.querySelector('.continue-btn') : null;

    const gozillaOutputSection = document.getElementById('gozilla-output');
    const gozillaVideo = document.getElementById('gozilla-output-video'); // Still useful for potential play logic
    const backButton = gozillaOutputSection ? gozillaOutputSection.querySelector('.back-btn') : null;

    if (exampleButton && gozillaOutputSection) {
        exampleButton.addEventListener('click', (event) => {
            event.preventDefault(); // Good practice for buttons that navigate

            gozillaOutputSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Tries to place the center of the element in the center of the viewport
                               // You can also use 'start' to align the top of the element with the top of the viewport
            });

            // Optional: If you want the video to attempt to play when scrolled to
            if (gozillaVideo && typeof gozillaVideo.play === 'function') {
                // The IntersectionObserver should handle play/pause,
                // but you could force a play attempt here if needed,
                // though it might conflict with the observer.
                // For now, let the observer manage it.
            }
        });
    } else {
        if (!exampleButton) console.warn("Example button (.continue-btn within #about) not found.");
        if (!gozillaOutputSection) console.warn("Gozilla output section (#gozilla-output) not found.");
    }

    // --- 新增：处理 "See the Method" 按钮的点击滚动事件 ---
    // --- 处理 "See the Method" 按钮的点击滚动事件 (修改版) ---

    // 1. 获取按钮和目标区域
    const seeMethodButton = document.getElementById('see-method-btn');
    const methodSection = document.getElementById('screen-01-part-d');

    // // 2. 在这里定义你的导航栏高度
    // const HEADER_HEIGHT = 70; // <-- 在这里修改为你导航栏的实际高度

    // 3. 确保按钮和目标区域都存在
    if (seeMethodButton && methodSection) {
        seeMethodButton.addEventListener('click', (event) => {
            // a. 阻止任何默认行为 (对于button来说可能不是必须，但好习惯)
            event.preventDefault();

            // b. 计算目标元素距离页面顶部的距离
            const elementTop = methodSection.offsetTop;

            // c. 计算最终要滚动到的位置 (元素顶部 - 导航栏高度)
            const scrollPosition = elementTop - HEADER_HEIGHT;

            // d. 使用平滑滚动到计算出的位置
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        });
    }

    // --- 新增：处理 "See the comparison 按钮的点击滚动事件 ---

    // 1. 获取按钮和目标区域
    const seeComparisonButton = document.getElementById('see-comparison-btn');
    const comparisonSection = document.getElementById('screen-01-part-e');

    // // 2. 在这里定义你的导航栏高度
    // const HEADER_HEIGHT = 70; // <-- 在这里修改为你导航栏的实际高度

    // 3. 确保按钮和目标区域都存在
    if (seeComparisonButton && comparisonSection) {
        seeComparisonButton.addEventListener('click', (event) => {
            // a. 阻止任何默认行为 (对于button来说可能不是必须，但好习惯)
            event.preventDefault();

            // b. 计算目标元素距离页面顶部的距离
            const elementTop = comparisonSection.offsetTop;

            // c. 计算最终要滚动到的位置 (元素顶部 - 导航栏高度)
            const scrollPosition = elementTop - HEADER_HEIGHT;

            // d. 使用平滑滚动到计算出的位置
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        });
    }


    if (backButton && aboutSection) {
        backButton.addEventListener('click', (event) => {
            event.preventDefault(); // Good practice

            if (gozillaVideo && typeof gozillaVideo.pause === 'function') {
                gozillaVideo.pause(); // Good to pause video when intentionally scrolling away
            }

            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // Scrolls so the top of the #about section is at the top of the viewport
            });
        });
    } else {
        if (!backButton) console.warn("Back button (.back-btn within #gozilla-output) not found.");
        if (!aboutSection && backButton) console.warn("#about section not found for scrolling back.");
    }



    // --- 全局选项卡按钮控制逻辑 ---

// --- 7. 全局选项卡按钮控制逻辑 (Active 由当前视口 Section 决定 + 滚动) ---

    // a. 定义按钮文本与目标 Section ID 的映射
    const globalTabTargets = {
        'Illustration': 'part-c-content',
        'Long Script': 'part-d-content',
        'Mini Series': 'part-e-content',
        'Emotion-Related': 'part-f-content'
        // 确保这些 ID 与你 HTML 中的实际 ID 一致
    };

    // b. 获取页面上所有的 .tab-btn 按钮
    const allGlobalTabButtons = document.querySelectorAll('main .tabs-nav .tab-btn');

    // c. 标志位，用于区分程序化滚动和用户手动滚动
    let isProgrammaticScroll = false;
    let programmaticScrollTimeout;

    function clearProgrammaticScrollFlag() {
        clearTimeout(programmaticScrollTimeout);
        programmaticScrollTimeout = setTimeout(() => {
            isProgrammaticScroll = false;
        }, 700); // 假设平滑滚动最多持续700ms
    }

    // d. 函数：根据当前应该激活的按钮文本，更新所有全局按钮的 active 状态
    function updateAllButtonActiveStates(activeButtonText) {
        allGlobalTabButtons.forEach(btn => {
            const buttonTextContent = btn.textContent.trim();
            // 只处理那些文本在 globalTabTargets 中的按钮（即全局按钮）
            if (globalTabTargets.hasOwnProperty(buttonTextContent)) {
                if (buttonTextContent === activeButtonText) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            } else {
                // 对于非全局按钮（局部选项卡按钮），如果希望它们在全局切换时都变为 inactive，
                // 或者有其他特定逻辑，可以在这里处理。
                // 为了简单起见，此函数主要关注全局按钮的同步。
                // 如果一个全局按钮被激活，同一导航栏内的非全局按钮应该 inactive。
                const parentNav = btn.closest('.tabs-nav');
                if (parentNav && activeButtonText) { // 如果是全局激活事件
                    let hasActiveGlobalSiblingInNav = false;
                    parentNav.querySelectorAll('.tab-btn').forEach(sibling => {
                        if (globalTabTargets.hasOwnProperty(sibling.textContent.trim()) && sibling.textContent.trim() === activeButtonText) {
                            hasActiveGlobalSiblingInNav = true;
                        }
                    });
                    if (hasActiveGlobalSiblingInNav) { // 如果此 nav 中有全局按钮被激活了
                        btn.classList.remove('active'); // 那么这个非全局按钮就取消激活
                    }
                }
            }
        });
    }

    // e. 为那些文本在全局映射中的按钮添加滚动和 active 更新事件
    allGlobalTabButtons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (globalTabTargets[buttonText]) { // 只为全局按钮添加这个点击监听器
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const currentButtonText = button.textContent.trim();
                const targetSectionId = globalTabTargets[currentButtonText];
                const sectionToScrollTo = document.getElementById(targetSectionId);

                if (sectionToScrollTo) {
                    isProgrammaticScroll = true; // 标记为程序化滚动
                    sectionToScrollTo.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                    updateAllButtonActiveStates(currentButtonText); // 点击后立即更新所有按钮状态
                    clearProgrammaticScrollFlag(); // 清除标记
                } else {
                    console.warn(`Target section with ID "${targetSectionId}" for button text "${currentButtonText}" not found.`);
                }
            });
        } else {
            // 这是非全局按钮（局部选项卡按钮）的点击事件
            // 它们应该只影响自己所在的 .tabs-nav 内部的 active 状态，
            // 并且不应该影响其他全局按钮或触发全局滚动。
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const parentNav = button.closest('.tabs-nav');
                if (parentNav) {
                    parentNav.querySelectorAll('.tab-btn').forEach(siblingBtn => {
                        // 只有当同导航栏的兄弟按钮也不是全局按钮时，才移除其 active
                        if (!globalTabTargets.hasOwnProperty(siblingBtn.textContent.trim())) {
                            siblingBtn.classList.remove('active');
                        }
                    });
                    button.classList.add('active');
                    // 在这里你需要添加切换该 section 内部具体内容的逻辑
                    // console.log(`Local button "${buttonText}" in nav "${parentNav.parentElement.id}" clicked.`);
                }
            });
        }
    });

    // f. Intersection Observer 监听全局 Sections 的可见性以更新按钮状态
    const globalSectionsToObserve = Object.values(globalTabTargets)
                                          .map(id => document.getElementById(id))
                                          .filter(Boolean); // 获取所有全局 section 元素

    if (globalSectionsToObserve.length > 0) {
        const sectionObserverOptions = {
            root: null,
            rootMargin: '-35% 0px -35% 0px', // Section 在视口中间约 30% 区域时触发
            threshold: 0.1 // 至少有部分交叉
        };

        let lastActivatedByScrollSectionId = null; // 防止因细微滚动重复激活

        const sectionVisibilityCallback = (entries, observer) => {
            if (isProgrammaticScroll) {
                return; // 忽略程序化滚动期间的 observer 事件
            }

            let mostProminentEntry = null;
            let highestVisibilityMetric = -1; // 使用一个综合指标

            entries.forEach(entry => {
                if (entry.isIntersecting) { // isIntersecting 受 rootMargin 影响
                    const rect = entry.boundingClientRect;
                    const viewportHeight = window.innerHeight;
                    // 计算元素在视口内的可见高度
                    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                    // 一个简单的可见性指标：可见高度 * 交叉比例 (更偏向于在“中间区域”内有较大显示面积的)
                    const visibilityMetric = visibleHeight * entry.intersectionRatio;

                    if (visibilityMetric > highestVisibilityMetric) {
                        highestVisibilityMetric = visibilityMetric;
                        mostProminentEntry = entry;
                    }
                }
            });

            if (mostProminentEntry) {
                const visibleSectionId = mostProminentEntry.target.id;

                if (lastActivatedByScrollSectionId === visibleSectionId &&
                    document.querySelector(`.tab-btn.active`)?.textContent.trim() === Object.keys(globalTabTargets).find(key => globalTabTargets[key] === visibleSectionId) ) {
                    // 如果是同一个 section 且对应的按钮已经是 active，则不重复操作
                    return;
                }

                let buttonTextToActivate = '';
                for (const text in globalTabTargets) {
                    if (globalTabTargets[text] === visibleSectionId) {
                        buttonTextToActivate = text;
                        break;
                    }
                }

                if (buttonTextToActivate) {
                    // console.log(`Observer wants to activate: ${buttonTextToActivate} for section ${visibleSectionId}`);
                    updateAllButtonActiveStates(buttonTextToActivate);
                    lastActivatedByScrollSectionId = visibleSectionId;
                }
            } else {
                // 如果没有 section 符合“突出”条件（例如滚动到页面顶部/底部空白区域）
                // 可以选择取消所有全局按钮的 active 状态，或者保持上一个状态
                // updateAllButtonActiveStates(null); // 取消所有激活
                lastActivatedByScrollSectionId = null;
            }
        };

        const sectionObserver = new IntersectionObserver(sectionVisibilityCallback, sectionObserverOptions);
        globalSectionsToObserve.forEach(section => sectionObserver.observe(section));
    }

    // g. 设置初始状态
    // 初始时，哪个按钮 active 取决于哪个 section 在页面加载时位于视口的“激活区域”
    // 或者，我们可以默认激活第一个（例如 "Demo"）
    const initialGlobalButtonText = 'Illustration';
    updateAllButtonActiveStates(initialGlobalButtonText);
    // 可选：初始滚动到 "Demo" section 并使其居中
    // const initialSectionElement = document.getElementById(globalTabTargets[initialGlobalButtonText]);
    // if (initialSectionElement) {
    //     isProgrammaticScroll = true;
    //     initialSectionElement.scrollIntoView({ behavior: 'auto', block: 'center' });
    //     clearProgrammaticScrollFlag();
    // }
    // 为了确保初始状态正确，特别是刷新页面时可能滚动位置不是顶部
    // 可以在加载后延迟一小会手动触发一次 observer 的检查（如果需要更精确的初始 active）
    // setTimeout(() => {
    //     if (typeof sectionObserver !== 'undefined' && sectionObserver.takeRecords) {
    //         sectionVisibilityCallback(sectionObserver.takeRecords(), sectionObserver);
    //     }
    // }, 250);


    // ====================================================================
    //      第二套全局选项卡：Abstract, Method, Comparison, Ablation
    // ====================================================================

    // a. 定义第二套按钮文本与目标 Section ID 的映射
    const academicTabTargets = {
        'Abstract': 'screen-01-part-c',
        'Method': 'screen-01-part-d',
        'Comparison': 'screen-01-part-e',
        'Ablation': 'screen-01-part-f'
    };

    // b. 获取页面上所有的 .tab-btn 按钮 (这一步可以复用之前的 allGlobalTabButtons)
    //    为清晰起见，我们重新获取一次，并确保它们是独立的。
    const allAcademicTabButtons = document.querySelectorAll('main .tabs-nav .tab-btn');

    // c. 标志位和相关函数 (这些可以复用，但为了代码隔离，我们重新定义)
    let isAcademicScroll = false;
    let academicScrollTimeout;

    function clearAcademicScrollFlag() {
        clearTimeout(academicScrollTimeout);
        academicScrollTimeout = setTimeout(() => {
            isAcademicScroll = false;
        }, 700); // 假设平滑滚动最多持续700ms
    }

    // d. 函数：根据当前应该激活的按钮文本，更新所有“学术”按钮的 active 状态
    function updateAllAcademicButtonActiveStates(activeButtonText) {
        allAcademicTabButtons.forEach(btn => {
            const buttonTextContent = btn.textContent.trim();
            // 只处理那些文本在 academicTabTargets 中的按钮
            if (academicTabTargets.hasOwnProperty(buttonTextContent)) {
                if (buttonTextContent === activeButtonText) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        });
    }

    // e. 为那些文本在“学术”映射中的按钮添加滚动和 active 更新事件
    allAcademicTabButtons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (academicTabTargets[buttonText]) { // 只为“学术”按钮添加这个点击监听器
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const currentButtonText = button.textContent.trim();
                const targetSectionId = academicTabTargets[currentButtonText];
                const sectionToScrollTo = document.getElementById(targetSectionId);

                if (sectionToScrollTo) {
                    isAcademicScroll = true; // 标记为程序化滚动
                    
                    // --- ▼▼▼ 核心修改在这里 ▼▼▼ ---

                    // 1. 获取固定的 header 高度 (如果存在)
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;

                    // 2. 定义一个额外的间距，给导航栏留出呼吸空间
                    const topOffset = headerHeight + 20; // 60px 的额外空间

                    // 3. 计算目标元素的精确位置
                    const elementPosition = sectionToScrollTo.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - topOffset;

                    // 4. 执行平滑滚动到计算好的位置
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // --- ▲▲▲ 核心修改结束 ▲▲▲ ---

                    updateAllAcademicButtonActiveStates(currentButtonText); // 点击后立即更新所有按钮状态
                    clearAcademicScrollFlag(); // 清除标记
                } else {
                    console.warn(`Target academic section with ID "${targetSectionId}" for button text "${currentButtonText}" not found.`);
                }
            });
        }
        // 注意：这里我们不需要 else 块，因为之前的逻辑已经处理了非“学术”按钮的点击事件。
    });

    // f. Intersection Observer 监听“学术” Sections 的可见性以更新按钮状态
    const academicSectionsToObserve = Object.values(academicTabTargets)
                                            .map(id => document.getElementById(id))
                                            .filter(Boolean); // 获取所有“学术” section 元素

    if (academicSectionsToObserve.length > 0) {
        const academicObserverOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // 当区域的上半部分进入视口时就激活
            threshold: 0.1
        };

        let lastActivatedByAcademicScrollSectionId = null;

        const academicSectionVisibilityCallback = (entries, observer) => {
            if (isAcademicScroll) {
                return; // 忽略程序化滚动期间的事件
            }

            let mostVisibleEntry = null;

            // 1. 遍历所有发生变化的元素
            entries.forEach(entry => {
                // 2. 如果当前元素在视口内可见
                if (entry.isIntersecting) {
                    // 3. 如果我们还没找到任何可见元素，或者当前元素的可见比例比之前找到的更大
                    if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
                        // 4. 那么就更新“最可见”的元素为当前元素
                        mostVisibleEntry = entry;
                    }
                }
            });

            // 5. 在遍历完所有元素后，如果我们找到了一个“最可见”的元素
            if (mostVisibleEntry) {
                const visibleSectionId = mostVisibleEntry.target.id;

                // 防止重复激活
                if (lastActivatedByAcademicScrollSectionId === visibleSectionId) return;

                let buttonTextToActivate = '';
                for (const text in academicTabTargets) {
                    if (academicTabTargets[text] === visibleSectionId) {
                        buttonTextToActivate = text;
                        break;
                    }
                }

                if (buttonTextToActivate) {
                    // console.log('Activating button for:', buttonTextToActivate); // 调试日志
                    updateAllAcademicButtonActiveStates(buttonTextToActivate);
                    lastActivatedByAcademicScrollSectionId = visibleSectionId;
                }
            }
            // 如果没有元素可见（例如滚动到了空白区域），可以保留上一个状态，或者取消所有激活
            // else {
            //     updateAllAcademicButtonActiveStates(null);
            // }
        };

        const academicObserver = new IntersectionObserver(academicSectionVisibilityCallback, academicObserverOptions);
        academicSectionsToObserve.forEach(section => academicObserver.observe(section));
    }

    // g. 设置初始状态 (可选)
    // 页面加载时，默认激活“学术”部分的第一个按钮
    // const initialAcademicButtonText = 'Abstract';
    // updateAllAcademicButtonActiveStates(initialAcademicButtonText);





    // --- 视频轮播切换逻辑 (修复版) ---
    const videoCarouselContainer = document.querySelector('.video-carousel-container');
    if (videoCarouselContainer) {
        const radioButtons = videoCarouselContainer.querySelectorAll('input[type="radio"]');
        
        // 将所有视频元素预先获取并存入一个对象，方便查找
        const videos = {
            overview: document.getElementById('method-overview-video'),
            detail1: document.getElementById('method-detail-video1'),
            detail2: document.getElementById('method-detail-video2'),
            detail3: document.getElementById('method-detail-video3'),
        };

        // 暂停所有视频的函数
        const pauseAllVideos = () => {
            for (const key in videos) {
                if (videos[key]) {
                    videos[key].pause();
                }
            }
        };

        // 切换视频并处理播放状态的函数
        const switchVideoSlide = (selectedValue) => {
            pauseAllVideos();

            // 隐藏所有幻灯片
            videoCarouselContainer.querySelectorAll('.video-slide').forEach(slide => {
                slide.classList.remove('active-slide');
            });

            // 显示对应的幻灯片
            const activeSlide = document.getElementById(`slide-${selectedValue}`);
            if (activeSlide) {
                activeSlide.classList.add('active-slide');
            }

            // 播放对应的视频
            const videoToPlay = videos[selectedValue];
            if (videoToPlay) {
                videoToPlay.play().catch(e => console.error(`Video play failed for ${selectedValue}:`, e));
            }
        };

        // 为所有单选按钮添加事件监听
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    switchVideoSlide(event.target.value);
                }
            });
        });

        // 初始化：页面加载时显示默认选中的视频
        const initialSelectedRadio = videoCarouselContainer.querySelector('input[type="radio"]:checked');
        if (initialSelectedRadio) {
            switchVideoSlide(initialSelectedRadio.value);
        }
    
        // IntersectionObserver - 当整个组件离开视口时，暂停所有视频
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    pauseAllVideos();
                } else {
                    // 当回到视口时，重新播放当前激活的那个视频
                    const currentSelectedRadio = videoCarouselContainer.querySelector('input[type="radio"]:checked');
                    if (currentSelectedRadio) {
                        switchVideoSlide(currentSelectedRadio.value);
                    }
                }
            });
        }, { threshold: 0.1 }); 

        observer.observe(videoCarouselContainer);
    }


    // --- 多视频同步轮播逻辑 --- comparison
    const carousel = document.querySelector('.multi-video-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoPlayInterval;

        // 1. 初始化函数
        function initCarousel() {
            if (totalSlides > 0) {
                // 生成导航圆点
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    dot.dataset.index = i;
                    dotsContainer.appendChild(dot);
                }
                
                // 激活第一个幻灯片和圆点
                updateCarousel(currentIndex);

                // 开始自动播放
                startAutoPlay();
            }
        }

        // 2. 更新轮播状态的函数 (核心)
        // 这是新的 updateCarousel 函数
        function updateCarousel(index) {
            currentIndex = index;

            // 1. 获取新的Prompt显示容器
            const promptDisplay = carousel.querySelector('.carousel-prompt-display');

            // 2. 切换幻灯片
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            // 3. 切换导航圆点
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // 4. 获取并更新Prompt文本
            const activeSlide = slides[currentIndex];
            if (activeSlide) {
                const promptElement = activeSlide.querySelector('.slide-prompt');
                if (promptDisplay && promptElement) {
                    // 将隐藏的prompt内容，更新到显示的容器里
                    promptDisplay.innerHTML = promptElement.innerHTML;
                }

                // 5. 播放当前幻灯片中的所有视频
                const videos = activeSlide.querySelectorAll('video');
                videos.forEach(video => {
                    // 如果视频还没有开始播放过，或者已经播放完毕，则重置
                    if (video.paused || video.ended) {
                        video.currentTime = 0;
                    }
                    video.play().catch(e => {});
                });

                // ✨ --- 性能优化核心：预加载下一组视频 --- ✨
                const nextIndex = (currentIndex + 1) % totalSlides;
                const nextSlide = slides[nextIndex];
                if (nextSlide) {
                    const nextVideos = nextSlide.querySelectorAll('video');
                    nextVideos.forEach(video => {
                        // 将 preload 设为 'auto' 会提示浏览器开始加载视频数据
                        // 如果视频已经在播放或已加载，此操作无害
                        if (video.preload !== 'auto') {
                            video.preload = 'auto';
                        }
                    });
                }
            }
        }

        // 3. 处理点击圆点事件
        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('dot')) {
                const index = parseInt(e.target.dataset.index);
                updateCarousel(index);
                // 重置自动播放计时器
                resetAutoPlay();
            }
        });

        // 4. 自动播放相关函数
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % totalSlides;
                updateCarousel(nextIndex);
            }, 5000); // 每5秒切换一次，可以调整
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // 5. 鼠标悬停时暂停/继续自动播放
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // 启动轮播
        initCarousel();
    }    


    // ========================================================
    //      Mini Series Carousel Logic (已集成滚动播放功能)
    // ========================================================
    const miniSeriesSection = document.getElementById('part-e-content');
    if (miniSeriesSection) {
        const carousel = miniSeriesSection.querySelector('.mini-series-carousel');
        if (carousel) {
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const dotsContainer = carousel.querySelector('.carousel-dots');

            // ▼▼▼ 核心修改区域：为轮播内的视频应用滚动播放逻辑 ▼▼▼
            const videosInCarousel = carousel.querySelectorAll('video');
            videosInCarousel.forEach((video, index) => {
                // 为每个视频生成一个唯一的ID，如果它还没有ID的话
                if (!video.id) {
                    video.id = `mini-series-video-${index}`;
                }
                // 调用全局的 setupIntersectionObserverForVideo 函数
                // 第二个参数为 true，表示尝试带声音播放
                setupIntersectionObserverForVideo(video.id, false);
            });
            // ▲▲▲ 核心修改区域结束 ▲▲▲

            // --- 轮播的核心控制逻辑 (这部分保持不变) ---
            if (slides.length > 1) {
                let slideWidth = carousel.offsetWidth;

                dotsContainer.innerHTML = '';
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('dot');
                    dot.addEventListener('click', () => goToSlide(index));
                    dotsContainer.appendChild(dot);
                });
                const dots = Array.from(dotsContainer.children);

                // ▼▼▼ 新版本：增加了主动播放逻辑 ▼▼▼
                const goToSlide = (targetIndex) => {
                    if (slideWidth === 0) slideWidth = carousel.offsetWidth;
                    track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
                    dots.forEach((dot, index) => dot.classList.toggle('active', index === targetIndex));

                    // 遍历所有幻灯片来控制视频
                    slides.forEach((slide, index) => {
                        const video = slide.querySelector('video');
                        if (video) {
                            if (index === targetIndex) {
                                // --- 这是新增的核心逻辑 ---
                                // 主动尝试播放当前幻灯片中的视频
                                video.play().catch(e => {
                                    // 如果因为浏览器策略（如用户未与页面交互）导致播放失败，
                                    // 打印一个静默的日志，而不是弹窗打扰用户。
                                    // IntersectionObserver 稍后仍有机会尝试播放它。
                                    console.log(`Could not autoplay video ${video.id}:`, e);
                                });
                            } else {
                                // 暂停所有其他不显示的视频
                                video.pause();
                            }
                        }
                    });
                };

                goToSlide(0);

                window.addEventListener('resize', () => {
                    slideWidth = carousel.offsetWidth;
                    const activeIndex = dots.findIndex(dot => dot.classList.contains('active'));
                    track.style.transition = 'none';
                    track.style.transform = `translateX(-${slideWidth * activeIndex}px)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                });
            } else if (dotsContainer) {
                dotsContainer.style.display = 'none';
            }
        }
    }


    // --- 新增：页脚引用复制功能 ---
    const copyBtn = document.getElementById('copy-citation-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const citationText = document.querySelector('.citation-box pre code').innerText;
            navigator.clipboard.writeText(citationText).then(() => {
                // 复制成功
                copyBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerText = 'Copy BibTeX';
                }, 2000); // 2秒后恢复原状
            }).catch(err => {
                // 复制失败
                console.error('Failed to copy citation: ', err);
                copyBtn.innerText = 'Error';
                setTimeout(() => {
                    copyBtn.innerText = 'Copy BibTeX';
                }, 2000);
            });
        });
    }    

    // --- 新增：视频灯箱功能 ---
    const lightbox = document.getElementById('video-lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeLightboxBtn = document.getElementById('close-lightbox-btn');
    const viewVideoBtns = document.querySelectorAll('.view-full-video-btn');

    if (lightbox) {
        // 为所有 "View Full Video" 按钮添加事件
        viewVideoBtns.forEach(button => {
            button.addEventListener('click', () => {
                const videoSrc = button.dataset.videoSrc; // 获取视频路径
                if (videoSrc) {
                    lightboxVideo.src = videoSrc; // 设置灯箱视频的源
                    lightbox.classList.add('active'); // 显示灯箱
                    document.body.style.overflow = 'hidden'; // 禁止背景滚动
                }
            });
        });

        // 关闭灯箱的函数
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightboxVideo.pause(); // 暂停视频
            lightboxVideo.src = ""; // 清空源，防止背景播放
            document.body.style.overflow = ''; // 恢复背景滚动
        };

        // 为关闭按钮添加事件
        closeLightboxBtn.addEventListener('click', closeLightbox);

        // 点击遮罩层空白处也可以关闭灯箱
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) { // 确保点击的是遮罩层本身，而不是视频
                closeLightbox();
            }
        });

        // 按下 "Esc" 键也可以关闭
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // --- 新增：处理 Hero 区域 "Learn More" 按钮的点击滚动事件 (加固版) ---

    // 1. 获取按钮和目标区域
    const learnMoreButton = document.getElementById('hero-learn-more-btn');
    const aboutSectionForScroll = document.getElementById('about'); // 使用新变量名避免冲突

    // 2. 检查两个元素是否都已成功加载到页面上
    if (learnMoreButton && aboutSectionForScroll) {
        
        // 3. 为按钮添加点击事件监听器
        learnMoreButton.addEventListener('click', (event) => {
            
            // a. 阻止按钮可能存在的默认行为（例如表单提交），这是一个好习惯
            event.preventDefault();

            // b. 明确地让目标区域平滑滚动到视口顶部
            console.log("Learn More button clicked, scrolling to #about section..."); // 添加日志，方便调试
            
            aboutSectionForScroll.scrollIntoView({
                behavior: 'smooth', // 平滑滚动动画
                block: 'center'      // 将目标元素的顶部与视口顶部对齐
            });
        });

    } else {
        // 如果找不到按钮或目标区域，在控制台给出警告，方便排查问题
        if (!learnMoreButton) {
            console.error('Error: "Learn More" button with ID "hero-learn-more-btn" not found.');
        }
        if (!aboutSectionForScroll) {
            console.error('Error: Target section with ID "about" not found.');
        }
    }


    // ========================================================
    //      全局图片悬停预览功能 - V2 (同步边框颜色)
    // ========================================================

    // 1. 获取需要悬停预览的图片和全局预览框
    const imagesToPreview = document.querySelectorAll('.input-image-grid img');
    const tooltip = document.getElementById('image-preview-tooltip');

    if (imagesToPreview.length > 0 && tooltip) {

        imagesToPreview.forEach(img => {
            // 2. 当鼠标进入图片区域时
            img.addEventListener('mouseenter', (event) => {
                // a. 获取图片的URL
                const imageUrl = img.getAttribute('src');
                
                // ★★★ 核心改动：获取小图当前的边框颜色 ★★★
                const computedStyle = window.getComputedStyle(img);
                const borderColor = computedStyle.getPropertyValue('border-color');
                
                // b. 将图片URL和边框颜色应用到预览框
                tooltip.style.backgroundImage = `url(${imageUrl})`;
                tooltip.style.borderColor = borderColor; // 应用读取到的颜色

                // c. 计算并设置预览框的位置
                const x = event.clientX + 15;
                const y = event.clientY + 15;
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;

                // d. 显示预览框
                tooltip.classList.add('visible');
            });

            // 3. 当鼠标离开图片区域时
            img.addEventListener('mouseleave', () => {
                // 隐藏预览框
                tooltip.classList.remove('visible');
            });

            // 4. 当鼠标在图片上移动时，实时更新预览框位置
            img.addEventListener('mousemove', (event) => {
                const x = event.clientX + 15;
                const y = event.clientY + 15;
                tooltip.style.left = `${x}px`;
                tooltip.style.top = `${y}px`;
            });
        });
    }

    // ========================================================
    //      处理“滚动到页面底部”的按钮点击事件
    // ========================================================

    // 1. 获取这个特殊的按钮
    const scrollToBottomButton = document.getElementById('scroll-to-bottom-btn');

    // 2. 确保按钮存在
    if (scrollToBottomButton) {
        // 3. 为它添加点击事件监听器
        scrollToBottomButton.addEventListener('click', (event) => {
            // a. 阻止链接的默认行为（比如跳转到页面顶部）
            event.preventDefault();

            // b. 计算页面的总高度
            //    document.body.scrollHeight 是获取整个页面内容的总高度
            const pageHeight = document.body.scrollHeight;

            // c. 使用 window.scrollTo 平滑滚动到计算出的位置
            window.scrollTo({
                top: pageHeight,    // 滚动到页面的最底部
                behavior: 'smooth'  // 使用平滑动画
            });
        });
    }
    
}); 