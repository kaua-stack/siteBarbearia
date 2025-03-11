document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const form = document.getElementById('agendamentoForm');
    const progressBar = document.getElementById('progress');
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');
    const stepInfoItems = document.querySelectorAll('.step-info-item');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const barberCards = document.querySelectorAll('.barber-card');
    const timeSlots = document.querySelectorAll('.time-slot');
    const bookingSuccess = document.getElementById('bookingSuccess');
    
    let currentStep = 1;
    const totalSteps = 5;
    
    // Initialize calendar
    initCalendar();
    
    // Check URL parameters for pre-selection
    checkUrlParams();
    
    // Update progress bar
    function updateProgress() {
        const percent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = percent + '%';
        
        // Update active step
        progressSteps.forEach((step, idx) => {
            if (idx + 1 < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (idx + 1 === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Update step info
        stepInfoItems.forEach((item, idx) => {
            if (idx + 1 === currentStep) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Go to next step
    function goToNextStep() {
        if (currentStep < totalSteps) {
            formSteps.forEach(step => step.classList.remove('active'));
            currentStep++;
            formSteps[currentStep - 1].classList.add('active');
            updateProgress();
            window.scrollTo(0, 0);
        }
    }
    
    // Go to previous step
    function goToPrevStep() {
        if (currentStep > 1) {
            formSteps.forEach(step => step.classList.remove('active'));
            currentStep--;
            formSteps[currentStep - 1].classList.add('active');
            updateProgress();
            window.scrollTo(0, 0);
        }
    }
    
    // Service selection
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            serviceCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store selected service
            const service = this.getAttribute('data-service');
            document.getElementById('selectedService').value = service;
            
            // Enable next button
            nextBtns[0].disabled = false;
        });
    });
    
    // Barber selection
    barberCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            barberCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store selected barber
            const barber = this.getAttribute('data-barber');
            document.getElementById('selectedBarber').value = barber;
            
            // Enable next button
            nextBtns[1].disabled = false;
        });
    });
    
    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                // Remove selected class from all slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                
                // Add selected class to clicked slot
                this.classList.add('selected');
                
                // Store selected time
                const time = this.getAttribute('data-time');
                document.getElementById('selectedTime').value = time;
                
                // Enable next button
                nextBtns[3].disabled = false;
            }
        });
    });
    
    // Next button click
    nextBtns.forEach(btn => {
        btn.addEventListener('click', goToNextStep);
    });
    
    // Previous button click
    prevBtns.forEach(btn => {
        btn.addEventListener('click', goToPrevStep);
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const service = document.getElementById('selectedService').value;
            const barber = document.getElementById('selectedBarber').value;
            const date = document.getElementById('selectedDate').value;
            const time = document.getElementById('selectedTime').value;
            const name = document.getElementById('clientName').value;
            const phone = document.getElementById('clientPhone').value;
            const email = document.getElementById('clientEmail').value;
            const notes = document.getElementById('clientNotes').value;
            
            // Display success message
            const successDetails = document.getElementById('successDetails');
            successDetails.innerHTML = `
                <p><strong>Serviço:</strong> ${service}</p>
                <p><strong>Barbeiro:</strong> ${barber}</p>
                <p><strong>Data:</strong> ${date}</p>
                <p><strong>Horário:</strong> ${time}</p>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
            `;
            
            bookingSuccess.classList.add('active');
            
            // Reset form
            // form.reset();
        });
    }
    
    // Close success message
    const backHomeBtn = document.querySelector('.back-home-btn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', function() {
            bookingSuccess.classList.remove('active');
            window.location.href = 'index.html';
        });
    }
    
    // Update confirmation details
    function updateConfirmation() {
        const service = document.getElementById('selectedService').value;
        const barber = document.getElementById('selectedBarber').value;
        const date = document.getElementById('selectedDate').value;
        const time = document.getElementById('selectedTime').value;
        
        document.getElementById('confirmService').textContent = service;
        document.getElementById('confirmBarber').textContent = barber;
        document.getElementById('confirmDate').textContent = date;
        document.getElementById('confirmTime').textContent = time;
        
        // Set price based on service
        let price = '';
        switch(service) {
            case 'Corte Degradê':
                price = 'R$ 35,00';
                break;
            case 'Barba':
                price = 'R$ 25,00';
                break;
            case 'Barba e Cabelo':
                price = 'R$ 50,00';
                break;
            default:
                price = 'R$ 0,00';
        }
        
        document.getElementById('confirmPrice').textContent = price;
    }
    
    // Calendar functionality
    function initCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const currentMonthElement = document.getElementById('currentMonth');
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        
        function renderCalendar() {
            // Clear previous days
            calendarDays.innerHTML = '';
            
            // Set current month and year
            const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
            
            // Get first day of month
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            
            // Get last day of month
            const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Add empty cells for days before first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                calendarDays.appendChild(emptyDay);
            }
            
            // Add days of month
            for (let day = 1; day <= lastDay; day++) {
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day');
                dayElement.textContent = day;
                
                // Check if day is in the past
                const dayDate = new Date(currentYear, currentMonth, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (dayDate < today) {
                    dayElement.classList.add('disabled');
                } else {
                    // Check if it's today
                    if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                        dayElement.classList.add('today');
                    }
                    
                    // Add click event
                    dayElement.addEventListener('click', function() {
                        // Remove selected class from all days
                        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                        
                        // Add selected class to clicked day
                        this.classList.add('selected');
                        
                        // Store selected date
                        const formattedDate = `${day.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
                        document.getElementById('selectedDate').value = formattedDate;
                        
                        // Enable next button
                        nextBtns[2].disabled = false;
                    });
                }
                
                calendarDays.appendChild(dayElement);
            }
        }
        
        // Render initial calendar
        renderCalendar();
        
        // Previous month button
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar();
            });
        }
        
        // Next month button
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar();
            });
        }
    }
    
    // Check URL parameters for pre-selection
    function checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('servico');
        const barberParam = urlParams.get('barbeiro');
        
        if (serviceParam) {
            const serviceCard = document.querySelector(`.service-card[data-service="${serviceParam}"]`);
            if (serviceCard) {
                serviceCard.click();
            }
        }
        
        if (barberParam) {
            setTimeout(() => {
                goToNextStep(); // Go to barber selection
                setTimeout(() => {
                    const barberCard = document.querySelector(`.barber-card[data-barber="${barberParam}"]`);
                    if (barberCard) {
                        barberCard.click();
                    }
                }, 100);
            }, 100);
        }
    }
    
    // Update confirmation details when going to confirmation step
    nextBtns[3].addEventListener('click', updateConfirmation);
});