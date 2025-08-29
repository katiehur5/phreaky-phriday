    import React from 'react';

    function EventCalendar() {
      return (
        <div>
          <h1>e v e n t s</h1>
          <iframe src="https://calendar.google.com/calendar/embed?src=c_c555f257f4e3cc1874cd5055988ab97cadec780ddae4b7544701a52fbe900e7a%40group.calendar.google.com&ctz=America%2FIndiana%2FIndianapolis" 
            style={{border: 0}}
            width="800" 
            height="600" 
            frameborder="0" 
            scrolling="no">
          </iframe>
        </div>
      );
    }

    export default EventCalendar;