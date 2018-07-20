function listItemTemplate(data) {
    var compiled = '';
    data.forEach(item => {
        compiled += `
        <div class="row">
            <div class="col-xs-5">${item.description}</div>
            <div class="col-xs-5"><strong>${item.feeling}</strong></div>
            <span class="col-xs-2">
            <button type="button" class="btn btn-xs btn-default" onclick="handleEditListItemClick(this)" data-listitem-id="${item._id}">Edit</button>
            </span>    
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
            window.itemList = list;
            $('#list-container').html(listItemTemplate(list));
        })
}

function submitListItemForm() {
    const listData = {
        description: $('#description').val(), 
        feeling:  $('#feeling').val(),
    };

    let method, url
    if (listData._id) {
        method = 'PUT'
        url = '/api/list/' + listData._id
    } else {
        method = 'POST'
        url = '/api/list'
    }

    fetch(url, {
        method: method,
        body: JSON.stringify(listData),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(list => {
        console.log("My new list Item!", list);
        cancelAddListItemForm();
        refreshWrensList();
    })
    .catch(err => {
        console.error("Something awful happened", err);
    })
}

function cancelAddListItemForm() {
    setForm();
    hideAddListItemForm();
}

function showAddListItemForm(){
    $('#add-listitem-form').show();
}

function hideAddListItemForm(){
    $('#add-listitem-form').hide();
}

function handleEditListItemClick(element) {
    const listitemId = element.getAttribute('data-listitem-id')
    
    const item = window.itemList.find(item => item._id === listitemId)
    if (item) {
       setForm(item);
    } 
    showAddListItemForm();
}

function setForm(data) {
    data = data || {};

    const item = {
        description: data.description || '',
        feeling: data.feeling || '',
        _id: data._id || '',
    };
        $('#description').val(item.description);
        $('#feeling').val(item.feeling);
        $('#item-id').val(item._id)

        if(item._id) {
            $('#form-label').text("Editing!")
        } else {
            $('#form-label').text("Adding to the List!")
        }
}