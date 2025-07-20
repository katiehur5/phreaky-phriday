    import React from 'react';

    function EventCalendar() {
      return (
        <div>
          <h1>e v e n t s</h1>
          <iframe
            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FIndiana%2FIndianapolis&showPrint=0&src=Y18wMDBkNzY5MWY4YTVjYmIxZjE1OTk5MmYwYzVhZjhjM2VhNzBjZDNlNzE0Y2E3NzZmZTE4ODgzZDJiMjIyYjljQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23e67c73"
            style={{ border: 0 }}
            width="800"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="APhi Events"
          ></iframe>
        </div>
      );
    }

    export default EventCalendar;