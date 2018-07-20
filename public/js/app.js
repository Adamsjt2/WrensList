function listItemTemplate(data) {
    var compiled = '';
    data.forEach(item => {
        compiled += `
        <div class="row">
            <div class="col-xs-6">${item.description}</div>
            <div class="col-xs-6"><strong>${item.feeling}</strong></div>
        </div>
        `;
    });
    return compiled;
}

function getList() {
    return $.ajax('/api/list')
      .then(res => {
        console.log("Results from getList()", res);
        return res;
      })
      .fail(err => {
        console.log("Error in getList()", err);
        throw err;
      });
}

function refreshWrensList() {
    getList()
        .then(list => {
            const data = {list: list};
            $('#list-container').html(listItemTemplate(data.list));
        })
};

function submitListItemForm() {
    const listData = {
        description: $('#description').val(), 
        feeling:  $('#feeling').val(),
    };

    fetch('/api/list', {
        method: 'post',
        body: JSON.stringify(listData),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(list => {
        refreshWrensList();
    });

    console.log("My new list Item!", listData);
};

function cancelListItemForm() {
    $('#add-listitem-form').reset();
};