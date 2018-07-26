//puts together each item in the list
function listItemTemplate(data) {
    var compiled = '';
    data.forEach(item => {
        compiled += `
        <div class="row ${item.feeling}">
            <div class="col-xs-5 formitem">${item.description}</div>
            <div class="col-xs-5 formitem" id="feeling">${item.feeling}</div>
            <span class="col-xs-2">
            <button type="button" class="btn btn-xs btn-default" onclick="handleEditListItemClick(this)" data-listitem-id="${item._id}">Edit</button>
            <button type="button" class="btn btn-xs btn-danger" onclick="handleDeleteListItemClick(this)" data-listitem-id="${item._id}">Delete</button>
            </span>    
        </div>
        
        `;
    });
    return compiled;
}

function getList() {
    return $.ajax('/api/item')
      .then(res => {
        console.log("Results from getList()", res);
        return res;
      })
      .fail(err => {
        console.log("Error in getList()", err);
        throw err;
      });
}

//refreshes the list with the latest database data
function refreshWrensList() {
    getList()
        .then(list => {
            window.itemList = list;
            $('#list-container').html(listItemTemplate(list));
        });
};

//decides if when the submit button is pushed if it's a PUT or POST request and then refreshes the list with updates
function submitListItemForm() {
    const itemData = {
        description: $('#description').val(), 
        feeling:  $('input.feeling:checked').val(),
        _id: $('#item-id').val()
    };

    let method, url;
    if (itemData._id) {
        method = 'PUT';
        url = '/api/item/' + itemData._id;
    } else {
        method = 'POST';
        url = '/api/item';
    };

    fetch(url, {
        method: method,
        body: JSON.stringify(itemData),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(item => {
        console.log("Wren's list has been updated", item);
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
    const itemId = element.getAttribute('data-listitem-id')
    
    const item = window.itemList.find(item => item._id === itemId)
    if (item) {
       setForm(item);
    } 
    showAddListItemForm();
}

//clears the form if there is no item id or if there is an item id, fills the form with the item's description and feeling
function setForm(data) {
    data = data || {};

    const item = {
        description: data.description || '',
        feeling: data.feeling || $("input[name='feeling']").prop('checked', false),
        _id: data._id || '',
    };
        $('#description').val(item.description);
        $("input.feeling[value='"+item.feeling+"']").prop('checked', true).val(item.feeling)
        $('#item-id').val(item._id)
        if(item._id) {
            $('#form-label').text("Editing!")
        } else {
            $('#form-label').text("Adding to the List!")
        }
        
}

function handleDeleteListItemClick(element) {
    const itemId = element.getAttribute('data-listitem-id')

    if (confirm("Are you sure you wish to delete this item?")) {
        deleteItem(itemId);
    }
}

//function that runs the delete route
function deleteItem(itemId) {
    const url = '/api/item/' + itemId;
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type' : 'application/json'}
    })
        .then(response => response.json())
        .then(response => {
            console.log("You've been deleted");
            refreshWrensList();
        })
        .catch(err => {
            console.error("Deletion Failed", err);
        });
}
