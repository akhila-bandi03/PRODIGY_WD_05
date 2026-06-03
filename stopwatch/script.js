document.addEventListener('DOMContentLoaded', () => {
    
    // --- State Variables ---
    let isRunning = false;
    let startTime = 0;
    let elapsedTime = 0; // Cumulative active running time in milliseconds
    let timerInterval = null;
    let lastLapTime = 0; // Cumulative time up to the end of the previous lap
    let laps = []; // Store lap details: { id, splitTime, cumulativeTime }

    // --- DOM Elements ---
    const stopwatchCard = document.querySelector('.stopwatch-card');
    
    // Digits
    const displayHours = document.getElementById('display-hours');
    const displayMinutes = document.getElementById('display-minutes');
    const displaySeconds = document.getElementById('display-seconds');
    const displayMs = document.getElementById('display-ms');
    
    // Progress Ring Fill
    const progressFill = document.getElementById('progress-fill');
    const ringCircumference = 816.8; // 2 * Math.PI * 130 (Radius of circle)

    // Control Buttons
    const startBtn = document.getElementById('start-btn');
    const lapBtn = document.getElementById('lap-btn');
    const resetBtn = document.getElementById('reset-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Lap List
    const lapsList = document.getElementById('laps-list');
    const emptyState = document.getElementById('empty-state');

    // Initialize stroke fill as empty
    progressFill.style.strokeDashoffset = ringCircumference;

    // --- Core Stopwatch Logic ---

    const startTimer = () => {
        if (isRunning) return;
        
        isRunning = true;
        stopwatchCard.classList.add('running');
        
        // Adjust start time to account for already elapsed time
        startTime = performance.now() - elapsedTime;
        
        // High-precision interval (approx 10ms for centisecond tracking)
        timerInterval = setInterval(updateTime, 10);
        
        // Button states
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        startBtn.className = 'btn btn-primary paused';
        lapBtn.removeAttribute('disabled');
        resetBtn.removeAttribute('disabled');
    };

    const pauseTimer = () => {
        if (!isRunning) return;
        
        isRunning = false;
        stopwatchCard.classList.remove('running');
        
        // Clear interval
        clearInterval(timerInterval);
        
        // Lock elapsed time precisely
        elapsedTime = performance.now() - startTime;
        
        // Button states
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
        startBtn.className = 'btn btn-primary';
        lapBtn.setAttribute('disabled', 'true');
    };

    const updateTime = () => {
        // High precision calculation
        const now = performance.now();
        const totalMs = now - startTime;
        
        // Update display digits
        renderTimerDigits(totalMs);
        
        // Update circular progress ring based on a 60-second cycle (60000ms)
        const secondsCycle = totalMs % 60000;
        const progressOffset = ringCircumference - (secondsCycle / 60000) * ringCircumference;
        progressFill.style.strokeDashoffset = progressOffset;
    };

    const renderTimerDigits = (totalMs) => {
        // Dissect milliseconds
        let remaining = totalMs;
        
        const hours = Math.floor(remaining / 3600000);
        remaining %= 3600000;
        
        const minutes = Math.floor(remaining / 60000);
        remaining %= 60000;
        
        const seconds = Math.floor(remaining / 1000);
        remaining %= 1000;
        
        const centiseconds = Math.floor(remaining / 10); // 2 digit precision

        displayHours.textContent = pad(hours, 2);
        displayMinutes.textContent = pad(minutes, 2);
        displaySeconds.textContent = pad(seconds, 2);
        displayMs.textContent = '.' + pad(centiseconds, 2);
    };

    const recordLap = () => {
        if (!isRunning) return;

        const currentTotalTime = performance.now() - startTime;
        const splitTime = currentTotalTime - lastLapTime;
        lastLapTime = currentTotalTime;

        const lapId = laps.length + 1;
        laps.unshift({
            id: lapId,
            splitTime: splitTime,
            cumulativeTime: currentTotalTime
        });

        renderLaps();
    };

    const resetTimer = () => {
        // Stop interval
        clearInterval(timerInterval);
        
        // Reset states
        isRunning = false;
        stopwatchCard.classList.remove('running');
        startTime = 0;
        elapsedTime = 0;
        lastLapTime = 0;
        laps = [];
        
        // Reset display digits
        displayHours.textContent = '00';
        displayMinutes.textContent = '00';
        displaySeconds.textContent = '00';
        displayMs.textContent = '.00';
        
        // Reset Progress ring
        progressFill.style.strokeDashoffset = ringCircumference;
        
        // Reset Buttons
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
        startBtn.className = 'btn btn-primary';
        lapBtn.setAttribute('disabled', 'true');
        resetBtn.setAttribute('disabled', 'true');
        clearBtn.setAttribute('disabled', 'true');

        // Reset Laps UI
        renderLaps();
    };

    const clearAllLaps = () => {
        laps = [];
        lastLapTime = 0;
        renderLaps();
    };

    // --- Helper Utilities ---

    const pad = (num, size) => {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    };

    const formatTimeInterval = (ms) => {
        let remaining = ms;
        
        const hours = Math.floor(remaining / 3600000);
        remaining %= 3600000;
        
        const minutes = Math.floor(remaining / 60000);
        remaining %= 60000;
        
        const seconds = Math.floor(remaining / 1000);
        remaining %= 1000;
        
        const centiseconds = Math.floor(remaining / 10);

        let output = '';
        if (hours > 0) {
            output += pad(hours, 2) + ':';
        }
        output += pad(minutes, 2) + ':' + pad(seconds, 2) + '.' + pad(centiseconds, 2);
        return output;
    };

    const renderLaps = () => {
        lapsList.innerHTML = '';
        
        if (laps.length === 0) {
            lapsList.appendChild(emptyState);
            clearBtn.setAttribute('disabled', 'true');
            return;
        }

        clearBtn.removeAttribute('disabled');
        
        // Identify fastest and slowest splits (only highlight if more than 1 lap exists)
        let minSplitIndex = -1;
        let maxSplitIndex = -1;
        
        if (laps.length > 1) {
            let minSplit = Infinity;
            let maxSplit = -Infinity;
            
            laps.forEach((lap, idx) => {
                if (lap.splitTime < minSplit) {
                    minSplit = lap.splitTime;
                    minSplitIndex = idx;
                }
                if (lap.splitTime > maxSplit) {
                    maxSplit = lap.splitTime;
                    maxSplitIndex = idx;
                }
            });
        }

        laps.forEach((lap, idx) => {
            const lapRow = document.createElement('div');
            lapRow.className = 'lap-row';
            
            // Highlight fastest and slowest splits
            if (laps.length > 1) {
                if (idx === minSplitIndex) {
                    lapRow.classList.add('fastest');
                } else if (idx === maxSplitIndex) {
                    lapRow.classList.add('slowest');
                }
            }

            lapRow.innerHTML = `
                <span class="lap-number">Lap ${lap.id}</span>
                <span class="lap-split">${formatTimeInterval(lap.splitTime)}</span>
                <span class="lap-cumulative">${formatTimeInterval(lap.cumulativeTime)}</span>
            `;
            lapsList.appendChild(lapRow);
        });
    };

    // --- Event Listeners ---

    startBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    lapBtn.addEventListener('click', recordLap);
    
    resetBtn.addEventListener('click', resetTimer);
    
    clearBtn.addEventListener('click', clearAllLaps);
});
