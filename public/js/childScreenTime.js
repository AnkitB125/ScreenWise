async function fetchChildRecords() {
    const childName = document.getElementById('childNameInput').value.trim();

    if (!childName) {
      M.toast({ html: 'Please enter a child name.' });
      return;
    }

    try {
      // Fetch child records from the API
      const response = await fetch(`/api/screentimeusage?childName=${childName}`);
      const data = await response.json();

      if (response.status === 200) {
        document.getElementById('childNameDisplay').textContent = data.childName;

        const dataTimeUsage = document.getElementById('table-body');

        dataTimeUsage.innerHTML = data.onlineActivity
          .map(activity => `<tr class="collection-item">${activity}</tr>`)
          .join('');
      } else {
        M.toast({ html: data });
      }
    } catch (error) {
      console.error('Error fetching child records:', error);
      M.toast({ html: 'An error occurred while fetching the data.' });
    }
  }