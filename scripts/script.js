// JavaScript for Mobile Menu, Smooth Scrolling, Countdown, and Cost Calculator
document.addEventListener('DOMContentLoaded', () => {
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const scrollLinks = document.querySelectorAll('.scroll-link, .mobile-scroll-link');

            // --- Mobile Menu Toggle ---
            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('hidden');
            });

            // --- Smooth Scrolling ---
            scrollLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('data-target') || (link.getAttribute('href') && link.getAttribute('href').substring(1));
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // Close mobile menu if open
                        if (!mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                            mobileMenuButton.setAttribute('aria-expanded', 'false');
                        }

                        // Scroll to the target element with a small offset for the fixed header
                        const headerOffset = 64; // Height of the fixed header
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                });
            });


            // --- Core Countdown Timer Logic ---
            // Set the target launch date (October 23, 2026, 12:00:00 UTC)
            const launchDate = new Date("October 23, 2026 12:00:00 UTC").getTime();
            document.getElementById("target-date-display").textContent = "October 23, 2026, 12:00:00 UTC";
            
            const formatNumber = (num) => String(num).padStart(2, '0');

            function startCountdown() {
                const now = new Date().getTime();
                let distance = launchDate - now;

                const daysEl = document.getElementById("countdown-days");
                const hoursEl = document.getElementById("countdown-hours");
                const minutesEl = document.getElementById("countdown-minutes");
                const secondsEl = document.getElementById("countdown-seconds");
                const messageEl = document.getElementById("launch-message");
                const displayEl = document.getElementById("countdown-display");
                
                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    
                    daysEl.textContent = formatNumber(days);
                    hoursEl.textContent = formatNumber(hours);
                    minutesEl.textContent = formatNumber(minutes);
                    secondsEl.textContent = formatNumber(seconds);
                    messageEl.classList.add("hidden");
                } else {
                    // Launch sequence complete
                    if(displayEl) {
                        // Switch to a larger, dramatic LIFT-OFF display
                        displayEl.innerHTML = '<div class="col-span-4 text-5xl lg:text-6xl xl:text-7xl font-extrabold text-red-500 animate-pulse p-4">LIFT-OFF!</div>';
                    }
                    if(messageEl) {
                        messageEl.textContent = "MISSION IS ACTIVE. WE ARE GO FOR ORBIT.";
                        messageEl.classList.remove("hidden");
                        messageEl.classList.add("text-green-400");
                        messageEl.classList.remove("text-red-500");
                    }
                    clearInterval(interval);
                    // Ensure gauges are maxed out on lift-off
                    updateGauges(100, 100);
                }
            }

            // --- Simulated Telemetry and Gauge Update Logic ---
            let currentVelocity = 0; // Max 100 km/s (100%)
            let currentPower = 85;   // Max 100%

            const velocityGauge = document.getElementById('velocity-gauge');
            const velocityValue = document.getElementById('velocity-value');
            const powerGauge = document.getElementById('power-gauge');
            const powerValue = document.getElementById('power-value');
            const telemetryLog = document.getElementById('telemetry-log');
            const maxLogLines = 10;

            function updateGauges() {
                // Only simulate pre-launch changes before T-minus is zero
                if (launchDate > new Date().getTime()) {
                    // Simulate minor velocity drift (pre-launch)
                    currentVelocity = Math.max(0, Math.min(2 + (Math.sin(Date.now() / 5000) * 1), 5)); // 0-5 km/s
                    
                    // Simulate minor power fluctuations
                    currentPower = Math.max(75, Math.min(90 + (Math.cos(Date.now() / 3000) * 5), 100)); // 75-100%
                } else {
                    // Post-Launch Simulation: Accelerate and stabilize power
                    currentVelocity = Math.min(100, currentVelocity + 2); // Accelerate to 100%
                    currentPower = 100; // Max power

                    // Force velocity color red for high speed after launch
                    velocityGauge.className = `h-full shadow-lg transition-colors duration-500 bg-red-500 shadow-red-500/50`;
                }

                // Update Velocity Gauge
                const velocityPercent = Math.min(100, (currentVelocity / 100) * 100);
                velocityGauge.style.width = `${velocityPercent}%`;
                velocityValue.textContent = currentVelocity.toFixed(2);
                
                // Update Power Gauge
                const powerPercent = Math.round(currentPower);
                powerGauge.style.width = `${powerPercent}%`;
                powerValue.textContent = `${powerPercent}%`;
                
                // Change power gauge color based on level
                if (powerPercent < 80) {
                    powerGauge.className = `h-full shadow-lg transition-colors duration-500 bg-red-500 shadow-red-500/50`;
                } else if (powerPercent < 95) {
                    powerGauge.className = `h-full shadow-lg transition-colors duration-500 bg-yellow-500 shadow-yellow-500/50`;
                } else {
                    powerGauge.className = `h-full shadow-lg transition-colors duration-500 bg-green-500 shadow-green-500/50`;
                }
            }

            function logTelemetry(message) {
                const log = telemetryLog;
                const now = new Date();
                // Ensure time formatting is 0-padded
                const time = formatNumber(now.getHours()) + ':' + formatNumber(now.getMinutes()) + ':' + formatNumber(now.getSeconds());
                const newEntry = document.createElement('p');
                newEntry.innerHTML = `[${time}] ${message}`;

                // Add to top (newest first)
                if (log.children.length > 0) {
                    log.insertBefore(newEntry, log.firstChild);
                } else {
                    log.appendChild(newEntry);
                }

                // Remove oldest logs if too many
                while (log.children.length > maxLogLines) {
                    log.removeChild(log.lastChild);
                }
            }

            // Initial log entry
            logTelemetry("Console initialized. Waiting for T-Minus countdown.");


            // Combined update function
            function updateDashboard() {
                startCountdown();
                updateGauges();
            }
            
            // Call the function once to avoid initial '00' display delay
            updateDashboard();

            // Update the dashboard every 1 second
            const interval = setInterval(updateDashboard, 1000);

            // Simulate random log entries every 3-7 seconds
            setInterval(() => {
                const messages = [
                    "Telemetry: Environmental pressure check - Nominal.",
                    "Guidance: Star-tracker calibration drift 0.001 deg. Acceptable.",
                    "Command: Hydrazine tank levels reporting Green.",
                    "T-Checks: Crew status - Rest/Sleep cycle complete. Ready for pre-launch.",
                    "Power: Primary bus voltage confirmed stable.",
                    "Warning: External debris tracking system reporting clear perimeter."
                ];
                const randomIndex = Math.floor(Math.random() * messages.length);
                logTelemetry(messages[randomIndex]);
            }, 5000 + Math.random() * 2000); // Between 5 and 7 seconds

            // --- Mission Cost Calculator Logic ---
            const missionCosts = {
                // Costs are in Billions (BCR)
                ares: { name: "Project Ares (Mars)", base: 150, durationMult: 5, payloadMult: 0.0012 }, // Payload mult is B/kg, so 1.2M/kg
                europa: { name: "DeepDive-7 (Europa)", base: 220, durationMult: 8, payloadMult: 0.0025 }, // Payload mult is B/kg, so 2.5M/kg
                luminaris: { name: "Luminaris Base (Lunar)", base: 75, durationMult: 3, payloadMult: 0.0008 } // Payload mult is B/kg, so 0.8M/kg
            };

            const form = document.getElementById('mission-cost-form');
            const resultLabel = document.getElementById('cost-result-label');
            const resultDisplay = document.getElementById('cost-result');

            function calculateMissionCost(event) {
                event.preventDefault(); // Stop the form from submitting normally

                const missionType = document.getElementById('mission-type').value;
                const duration = parseFloat(document.getElementById('duration').value);
                // Payload is in THOUSANDS of kg, so we multiply by 1000 to get kg.
                const payloadMassKg = parseFloat(document.getElementById('payload').value) * 1000; 

                const mission = missionCosts[missionType];

                if (!mission || isNaN(duration) || isNaN(payloadMassKg) || duration <= 0 || payloadMassKg <= 0) {
                    resultLabel.textContent = "Error: Please check all required parameters.";
                    resultDisplay.textContent = "NaN";
                    resultDisplay.classList.remove('text-green-400');
                    resultDisplay.classList.add('text-red-400');
                    return;
                }

                // Calculation: Base Cost + (Duration Cost) + (Payload Cost)
                const totalCost = mission.base + 
                                  (duration * mission.durationMult) + 
                                  (payloadMassKg * mission.payloadMult); // PayloadMult is B/kg

                // Update UI
                resultLabel.textContent = `Estimated cost for ${mission.name}:`;
                resultDisplay.textContent = totalCost.toFixed(2);
                resultDisplay.classList.remove('text-red-400');
                resultDisplay.classList.add('text-green-400');
            }

            form.addEventListener('submit', calculateMissionCost);
            
            // Initial calculation on load for default values
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        });