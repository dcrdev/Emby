﻿define(['dialogHelper', 'loading', 'connectionManager', 'embyRouter', 'globalize', 'paper-checkbox', 'paper-input', 'paper-icon-button-light', 'emby-select'], function (dialogHelper, loading, connectionManager, embyRouter, globalize) {

    var currentServerId;

    function parentWithClass(elem, className) {

        while (!elem.classList || !elem.classList.contains(className)) {
            elem = elem.parentNode;

            if (!elem) {
                return null;
            }
        }

        return elem;
    }

    function onSubmit(e) {
        loading.show();

        var panel = parentWithClass(this, 'dialog');

        var collectionId = panel.querySelector('#selectCollectionToAddTo').value;

        var apiClient = connectionManager.getApiClient(currentServerId);

        if (collectionId) {
            addToCollection(apiClient, panel, collectionId);
        } else {
            createCollection(apiClient, panel);
        }

        e.preventDefault();
        return false;
    }

    function createCollection(apiClient, dlg) {

        var url = apiClient.getUrl("Collections", {

            Name: dlg.querySelector('#txtNewCollectionName').value,
            IsLocked: !dlg.querySelector('#chkEnableInternetMetadata').checked,
            Ids: dlg.querySelector('.fldSelectedItemIds').value || ''

            //ParentId: getParameterByName('parentId') || LibraryMenu.getTopParentId()

        });

        apiClient.ajax({
            type: "POST",
            url: url,
            dataType: "json"

        }).then(function (result) {

            loading.hide();

            var id = result.Id;

            dialogHelper.close(dlg);
            redirectToCollection(apiClient, id);

        });
    }

    function redirectToCollection(apiClient, id) {

        apiClient.getItem(apiClient.getCurrentUserId(), id).then(function (item) {

            embyRouter.showItem(item);
        });
    }

    function addToCollection(apiClient, dlg, id) {

        var url = apiClient.getUrl("Collections/" + id + "/Items", {

            Ids: dlg.querySelector('.fldSelectedItemIds').value || ''
        });

        apiClient.ajax({
            type: "POST",
            url: url

        }).then(function () {

            loading.hide();

            dialogHelper.close(dlg);

            require(['toast'], function (toast) {
                toast(globalize.translate('MessageItemsAdded'));
            });
        });
    }

    function onDialogClosed() {

        loading.hide();
    }

    function triggerChange(select) {
        select.dispatchEvent(new CustomEvent('change', {}));
    }

    function populateCollections(panel) {

        loading.show();

        var select = panel.querySelector('#selectCollectionToAddTo');

        panel.querySelector('.newCollectionInfo').classList.add('hide');

        var options = {

            Recursive: true,
            IncludeItemTypes: "BoxSet",
            SortBy: "SortName"
        };

        var apiClient = connectionManager.getApiClient(currentServerId);
        apiClient.getItems(apiClient.getCurrentUserId(), options).then(function (result) {

            var html = '';

            html += '<option value="">' + globalize.translate('OptionNewCollection') + '</option>';

            html += result.Items.map(function (i) {

                return '<option value="' + i.Id + '">' + i.Name + '</option>';
            });

            select.innerHTML = html;
            select.value = '';
            triggerChange(select);

            loading.hide();
        });
    }

    function getEditorHtml() {

        var html = '';

        html += '<form class="newCollectionForm" style="margin:auto;">';

        html += '<div>';
        html += globalize.translate('CreateCollectionHelp');
        html += '</div>';

        html += '<div class="fldSelectCollection">';
        html += '<br/>';
        html += '<br/>';
        html += '<select is="emby-select" label="' + globalize.translate('LabelSelectCollection') + '" id="selectCollectionToAddTo" autofocus></select>';
        html += '</div>';

        html += '<div class="newCollectionInfo">';

        html += '<div>';
        html += '<paper-input type="text" id="txtNewCollectionName" required="required" label="' + globalize.translate('LabelName') + '"></paper-input>';
        html += '<div class="fieldDescription">' + globalize.translate('NewCollectionNameExample') + '</div>';
        html += '</div>';

        html += '<br />';
        html += '<br />';

        html += '<div>';
        html += '<paper-checkbox id="chkEnableInternetMetadata">' + globalize.translate('OptionSearchForInternetMetadata') + '</paper-checkbox>';
        html += '</div>';

        // newCollectionInfo
        html += '</div>';

        html += '<br />';
        html += '<div>';
        html += '<button type="submit" class="clearButton" data-role="none"><paper-button raised class="submit block">' + globalize.translate('ButtonOk') + '</paper-button></button>';
        html += '</div>';

        html += '<input type="hidden" class="fldSelectedItemIds" />';

        html += '</form>';

        return html;
    }

    function initEditor(content, items) {

        content.querySelector('#selectCollectionToAddTo').addEventListener('change', function () {
            if (this.value) {
                content.querySelector('.newCollectionInfo').classList.add('hide');
                content.querySelector('#txtNewCollectionName').removeAttribute('required');
            } else {
                content.querySelector('.newCollectionInfo').classList.remove('hide');
                content.querySelector('#txtNewCollectionName').setAttribute('required', 'required');
            }
        });

        content.querySelector('.newCollectionForm').addEventListener('submit', onSubmit);

        content.querySelector('.fldSelectedItemIds', content).value = items.join(',');

        if (items.length) {
            content.querySelector('.fldSelectCollection').classList.remove('hide');
            populateCollections(content);
        } else {
            content.querySelector('.fldSelectCollection').classList.add('hide');

            var selectCollectionToAddTo = content.querySelector('#selectCollectionToAddTo');
            selectCollectionToAddTo.innerHTML = '';
            selectCollectionToAddTo.value = '';
            triggerChange(selectCollectionToAddTo);
        }
    }

    function collectioneditor() {

        var self = this;

        self.show = function (options) {

            var items = options.items || {};
            currentServerId = options.serverId;

            var dlg = dialogHelper.createDialog({
                size: 'small',
                removeOnClose: true
            });

            dlg.classList.add('ui-body-b');
            dlg.classList.add('background-theme-b');

            var html = '';
            var title = items.length ? globalize.translate('HeaderAddToCollection') : globalize.translate('HeaderNewCollection');

            html += '<div class="dialogHeader" style="margin:0 0 2em;">';
            html += '<button is="paper-icon-button-light" class="btnCancel" tabindex="-1"><iron-icon icon="nav:arrow-back"></iron-icon></button>';
            html += '<div class="dialogHeaderTitle">';
            html += title;
            html += '</div>';

            html += '<a href="https://github.com/MediaBrowser/Wiki/wiki/Collections" target="_blank" style="margin-left:auto;margin-right:.5em;display:inline-block;padding:.25em;display:flex;align-items:center;" title="' + globalize.translate('ButtonHelp') + '"><iron-icon icon="info"></iron-icon><span style="margin-left:.25em;">' + globalize.translate('ButtonHelp') + '</span></a>';

            html += '</div>';

            html += getEditorHtml();

            dlg.innerHTML = html;
            document.body.appendChild(dlg);

            initEditor(dlg, items);

            dlg.addEventListener('close', onDialogClosed);

            dialogHelper.open(dlg);

            dlg.querySelector('.btnCancel').addEventListener('click', function () {

                dialogHelper.close(dlg);
            });
        };
    }

    return collectioneditor;
});