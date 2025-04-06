const uploadCard = document.getElementById('uploadCard');
const modal = document.getElementById('uploadModal');
const closeBtn = document.querySelector('.close-button');
const form = document.getElementById('uploadForm');
const status = document.getElementById('uploadStatus');

uploadCard.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  status.textContent = '';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    status.textContent = '';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('pdfFile');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  status.textContent = 'Uploading and generating flashcards...';

  try {
    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      status.textContent = data.error || 'An error occurred during upload.';
      return;
    }

    console.log('Flashcards:', data.flashcards);
    status.textContent = 'Flashcards generated! Check the console.';

  } catch (err) {
    console.error('Upload error:', err);
    status.textContent = 'Network error. Please try again.';
  }
});

const fileInput = document.getElementById('pdfInput');
const resultsContainer = document.getElementById('flashcardResults');

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  resultsContainer.innerHTML = "Uploading and generating flashcards...";

  try {
    const response = await fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.flashcards) {
      renderFlashcards(data.flashcards);
    } else {
      resultsContainer.innerHTML = "Failed to generate flashcards.";
    }
  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = "Error occurred while uploading.";
  }
});

function renderFlashcards(flashcards) {
  resultsContainer.innerHTML = '<h3 style="color:white;">Generated Flashcards</h3>';
  const list = document.createElement('ul');
  list.style.textAlign = "left";

  flashcards.forEach(card => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Q:</strong> ${card.question}<br><strong>A:</strong> ${card.answer}`;
    li.style.marginBottom = "1rem";
    list.appendChild(li);
  });

  resultsContainer.appendChild(list);
}
