


const $0eef8c9ebc99dcbd$export$671f7ea0f01fc8d6 = {
    update: (node, options, key)=>{
        const value = typeof options[key] === "function" ? options[key]() : options[key];
        requestAnimationFrame((time)=>{
            if (value) requestAnimationFrame((time)=>{
                node.classList.add(key);
            });
            else requestAnimationFrame((time)=>{
                node.classList.remove(key);
            });
        });
    }
};
const $0eef8c9ebc99dcbd$export$c0b321ba3364f87f = {
    update: (node, options, key)=>{
        const value = typeof options[key] === "function" ? options[key]() : options[key];
        if (typeof value === "boolean") {
            if (value) node.setAttribute(key, "");
            else node.removeAttribute(key);
        } else if (value) node.setAttribute(key, value);
    }
};
const $0eef8c9ebc99dcbd$export$1cce1f6bc2555064 = {
    stop: (event)=>event.stopPropagation(),
    create: (node, options, directive)=>{
        if (typeof options.change === "function") {
            if (options.stop) node.addEventListener("click", directive.stop);
            document.addEventListener("click", options.change);
        }
    },
    destroy: (node, options, directive)=>{
        if (options.stop) node.removeEventListener("click", directive.stop);
        document.removeEventListener("click", options.change);
    }
};




var $2ea3da52504f7b21$export$2e2bcd8739ae039 = {
    template: `
  <button class="lstBtn l-fx-b l-br">
    <span class="lstBtnIcon l-fx l-jc-center"></span>
    <span class="lstBtnText"></span>
  </button>`,
    directives: {
        _attr: $0eef8c9ebc99dcbd$export$c0b321ba3364f87f
    },
    props: {
        proxies: {
            value: {},
            disabled: {},
            error: {}
        },
        params: {
            name: {
                default: ""
            },
            type: {
                default: "button"
            },
            size: {
                default: "medium"
            },
            text: {},
            options: {
                default: {}
            }
        },
        methods: {
            action: {}
        }
    },
    nodes () {
        return {
            lstBtn: {
                _class: {
                    "l-fx-rev": this.param.options.iconPosition === "end"
                },
                _attr: {
                    size: this.param.size
                },
                name: this.param.name,
                type: this.param.type,
                disabled: ()=>this.proxy.disabled,
                onclick: ()=>this.method.action?.(this.param.name)
            },
            lstBtnIcon: {
                _class: {
                    lstSpinner: ()=>this.proxy.error
                },
                _html: ()=>this.param.options.icon
            },
            lstBtnText: {
                _text: ()=>this.param.text ?? this.proxy.value
            }
        };
    },
    methods: {
        spinner (v) {
            this.proxy.error = v;
        }
    }
};


var $e4d8ac047ff8b39b$export$2e2bcd8739ae039 = {
    template: `<div class="lstTabs l-fx"></div><div section="content"></div>`,
    props: {
        proxies: {
            tabs: {},
            selectedIndex: {
                default: 0
            }
        },
        methods: {
            change: {}
        }
    },
    setters: {
        selectedIndex (v) {
            this.node.lstTabs.children[this.proxy.selectedIndex].classList.remove("l-active");
            return v;
        }
    },
    handlers: {
        selectedIndex (v) {
            this.node.lstTabs.children[v].classList.add("l-active");
        }
    },
    nodes () {
        return {
            lstTabs: {
                component: {
                    iterate: ()=>this.proxy.tabs,
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        name: (_, i)=>i,
                        text: (el)=>el,
                        type: "text",
                        size: "large"
                    },
                    methods: {
                        action: this.method.change
                    }
                }
            }
        };
    },
    mounted () {
        this.node.lstTabs.children[this.proxy.selectedIndex].classList.add("l-active");
    }
};



var $0792d065642543d7$export$2e2bcd8739ae039 = {
    template: `<tr class="lstTr"></tr>`,
    props: {
        params: {
            index: {
                type: "number"
            },
            realIndex: {
                type: "number"
            }
        },
        proxies: {
            row: {
                type: "object"
            },
            _selected: {
                type: "array"
            }
        },
        methods: {
            action: {}
        }
    },
    nodes () {
        return {
            lstTr: {
                _evalHTML: ()=>{
                    let str = `<td>${this.param.index}</td>`;
                    for (const [key, value] of Object.entries(this.proxy.row))str += `<td name="${key}" title="${value}">${value}</td>`;
                    return str;
                },
                _class: {
                    selected: ()=>this.proxy._selected.includes(this.param.realIndex)
                },
                onclick: ()=>this.method.action(this.proxy.row, this.param.realIndex)
            }
        };
    }
};


var $4305de725ffaedcf$export$2e2bcd8739ae039 = {
    template: `<table class="lstTable">
    <tbody class="lstTableHeader"></tbody>
    <tbody class="lstTableBody"></tbody>
  </table>`,
    props: {
        params: {
            header: {
                type: "array"
            },
            options: {
                ignore: true
            }
        },
        proxies: {
            _tbody: {
                type: "array"
            },
            _selected: {
                type: "array"
            }
        },
        methods: {
            action: {}
        }
    },
    nodes () {
        return {
            lstTableHeader: {
                _evalHTML: ()=>this.proxy._tbody && this.method.header(this.param.options.header())
            },
            lstTableBody: {
                component: {
                    src: (0, $0792d065642543d7$export$2e2bcd8739ae039),
                    iterate: ()=>this.proxy._tbody,
                    params: {
                        index: (_, i)=>this.param.options.index(i),
                        realIndex: (_, i)=>i
                    },
                    proxies: {
                        row: (el)=>el,
                        _selected: ()=>this.proxy._selected
                    },
                    methods: {
                        action: this.method.action
                    }
                }
            }
        };
    },
    methods: {
        header (header) {
            if (!header) return "";
            return "<colgroup>" + header.reduce((html)=>html + `<col />`, "") + "</colgroup>" + "<tr>" + header.reduce((html, current)=>html + `<th>${current}</th>`, "<th></th>") + "</tr>";
        }
    }
};




var $47123e8812db6242$export$2e2bcd8739ae039 = {
    template: `
  <dialog class="lstDialog l-scrollbar">
    <div class="lstClose"></div>
    <h3 class="lstDialogHd"></h3>
    <p class="lstDialogTxt"></p>
    <div section="content"></div>
    <div class="l-fx l-jc-end">
      <div class="lstDialogReject"></div>
      <div class="lstDialogAllow"></div>
    </div>
  </dialog>`,
    props: {
        params: {
            cancelable: {},
            expanded: {},
            name: {},
            title: {},
            text: {},
            allow: {},
            reject: {}
        },
        proxies: {
            opened: {
                default: false
            }
        },
        methods: {
            onclose: {},
            allow: {},
            reject: {}
        }
    },
    handlers: {
        opened (v) {
            v ? this.node.lstDialog.showModal() : this.node.lstDialog.close();
        }
    },
    nodes () {
        return {
            lstDialog: {
                _class: {
                    "l-full-screen": ()=>this.param.expanded,
                    ["dialog_" + this.param.name]: ()=>this.param.name
                },
                oncancel: (e)=>{
                    this.param.cancelable ? this.method.onclose() : e.preventDefault();
                }
            },
            lstClose: {
                hidden: !this.param.cancelable,
                onclick: ()=>this.method.onclose()
            },
            lstDialogHd: {
                _text: ()=>this.param.title
            },
            lstDialogTxt: {
                _text: ()=>this.param.text
            },
            lstDialogReject: {
                component: {
                    induce: ()=>this.param.reject,
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        text: ()=>this.param.reject.text,
                        type: ()=>this.param.reject.type || "text"
                    },
                    methods: {
                        action: ()=>{
                            this.method.reject?.();
                            this.method.onclose();
                        }
                    }
                }
            },
            lstDialogAllow: {
                component: {
                    induce: ()=>this.param.allow,
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        text: ()=>this.param.allow.text,
                        type: ()=>this.param.allow.type || "text"
                    },
                    methods: {
                        action: ()=>{
                            this.method.allow?.();
                            this.method.onclose();
                        }
                    }
                }
            }
        };
    },
    methods: {
        opened (v) {
            this.proxy.opened = v;
        }
    },
    mounted () {
        this.proxy.opened && this.node.lstDialog.showModal();
    }
};





var $d3df01a87d523612$export$2e2bcd8739ae039 = {
    template: `
  <label class="lstCheckbox">
    <input type="checkbox" class="lstCheckboxInp">
    <span class="lstCheckmark"></span>
    <span class="lstCheckboxText"></span>
  </label>`,
    directives: {
        _attr: $0eef8c9ebc99dcbd$export$c0b321ba3364f87f
    },
    props: {
        proxies: {
            value: {},
            disabled: {},
            error: {}
        },
        params: {
            name: {
                default: ""
            },
            size: {
                default: "medium"
            },
            text: {}
        },
        methods: {
            action: {}
        }
    },
    nodes () {
        return {
            lstCheckbox: {
                _attr: {
                    size: this.param.size
                }
            },
            lstCheckboxInp: {
                checked: ()=>this.proxy.value,
                onchange: (event)=>{
                    this.proxy.value = event.target.checked;
                    this.method.action?.(this.param.name, event.target.checked);
                }
            },
            lstCheckboxText: {
                _text: ()=>this.param.text ?? ""
            }
        };
    },
    methods: {
        set (v) {
            this.proxy.value = v;
        }
    }
};


var $618fab82c66c9ac2$export$2e2bcd8739ae039 = {
    template: `<div class="checkboxes l-content"></div>`,
    props: {
        proxies: {
            _checkboxes: {}
        },
        methods: {
            change: {}
        }
    },
    nodes () {
        return {
            checkboxes: {
                component: {
                    iterate: ()=>this.proxy._checkboxes,
                    src: (0, $d3df01a87d523612$export$2e2bcd8739ae039),
                    params: {
                        text: (el)=>el.title,
                        name: (_, i)=>i
                    },
                    proxies: {
                        value: (el)=>el.checked
                    },
                    methods: {
                        action: this.method.change
                    }
                }
            }
        };
    }
};


var $917d4b5ddb6d74b4$export$2e2bcd8739ae039 = {
    template: `<div class="dialog"></div>
      <div class="l-content">
      <div class="controls l-fx l-gap l-ai-c">
        <div class="settings"></div>
        <div class="count"></div>
        <div class="remove"></div>
        <div class="export"></div>
        <div class="chemistry"></div>
      </div>
      <div class="table"></div>
    </div>`,
    props: {
        params: {
            data: {},
            fields: {},
            key: {}
        }
    },
    proxies: {
        fields: [],
        data: [],
        selected: [],
        opened: false
    },
    nodes () {
        return {
            dialog: {
                component: {
                    src: (0, $47123e8812db6242$export$2e2bcd8739ae039),
                    params: {
                        // name: dialog.name,
                        title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0442\u0430\u0431\u043B\u0438\u0446\u044B",
                        text: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u043B\u044F \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
                        allow: {
                            text: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C"
                        },
                        reject: {
                            text: "\u041E\u0442\u043C\u0435\u043D\u0430"
                        }
                    },
                    proxies: {
                        opened: ()=>this.proxy.opened
                    },
                    methods: {
                        onclose: ()=>this.proxy.opened = false,
                        reject: ()=>{
                            this.proxy.fields = this.param.fields;
                        },
                        allow: ()=>{
                            this.param.fields = lesta.replicate(this.proxy.fields);
                            this.proxy.data = this.method.mapping(this.param.data);
                        }
                    },
                    sections: {
                        content: {
                            src: (0, $618fab82c66c9ac2$export$2e2bcd8739ae039),
                            proxies: {
                                _checkboxes: ()=>this.proxy.fields
                            },
                            methods: {
                                change: (i, v)=>{
                                    this.proxy.fields[i].checked = v;
                                }
                            }
                        }
                    }
                }
            },
            count: {
                _text: ()=>`${this.proxy.data.length} / ${this.proxy.selected.length}`
            },
            settings: {
                component: {
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        options: {
                            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
<path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
                        }
                    },
                    methods: {
                        action: ()=>this.proxy.opened = true
                    }
                }
            },
            remove: {
                component: {
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        type: "primary"
                    },
                    proxies: {
                        value: ()=>"\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                        disabled: ()=>this.proxy.selected.length === 0
                    },
                    methods: {
                        action: this.method.remove
                    }
                }
            },
            export: {
                component: {
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        type: "primary",
                        text: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 CSV"
                    },
                    methods: {
                        action: this.method.downloadCSV
                    }
                }
            },
            chemistry: {
                hidden: ()=>this.param.key !== "wells",
                component: {
                    src: (0, $2ea3da52504f7b21$export$2e2bcd8739ae039),
                    params: {
                        type: "primary",
                        text: "\u0425\u0438\u043C\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0430\u043D\u0430\u043B\u0438\u0437\u044B"
                    },
                    methods: {
                        action: ()=>window.parent.open(this.config.services.choosen_chem(this.param.data), "_blank")
                    }
                }
            },
            table: {
                component: {
                    src: (0, $4305de725ffaedcf$export$2e2bcd8739ae039),
                    params: {
                        options: {
                            header: ()=>this.proxy.fields.filter((el)=>el.checked).map((el)=>el.title),
                            index: (index)=>index + 1
                        }
                    },
                    proxies: {
                        _tbody: ()=>this.proxy.data,
                        _selected: ()=>this.proxy.selected
                    },
                    methods: {
                        action: (el, i)=>{
                            const index = this.proxy.selected.indexOf(i);
                            index === -1 ? this.proxy.selected.push(i) : this.proxy.selected.splice(index, 1);
                        }
                    }
                }
            }
        };
    },
    methods: {
        filterObjects (arr, keys) {
            return arr.map((obj)=>keys.reduce((acc, key)=>(key in obj && (acc[key] = obj[key]), acc), {}));
        },
        remove () {
            this.param.data = this.param.data.filter((element, index)=>!this.proxy.selected.includes(index));
            this.proxy.data = this.method.mapping(this.param.data);
            this.proxy.selected = [];
        },
        convertArrayOfObjectsToCSV (data) {
            let csv = "";
            const fields = this.proxy.fields.filter((el)=>el.checked);
            const keys = fields.map((el)=>el.key);
            csv += fields.map((el)=>`"${el.title.replace(/"/g, "")}"`).join(",") + "\n";
            data.forEach((item)=>{
                keys.forEach((key, index)=>{
                    if (index > 0) csv += ",";
                    let fieldValue = item[key];
                    if (typeof fieldValue === "string" && (fieldValue.includes(",") || fieldValue.includes('"') || fieldValue.includes("\n"))) fieldValue = `"${fieldValue.replace(/"/g, '""')}"`;
                    else if (typeof fieldValue === "number" && !isNaN(fieldValue)) fieldValue = fieldValue.toString();
                    csv += fieldValue;
                });
                csv += "\n";
            });
            return csv;
        },
        downloadCSV () {
            const data = this.proxy.data;
            const filename = "data.csv";
            const csv = this.method.convertArrayOfObjectsToCSV(data);
            const csvFile = new Blob([
                csv
            ], {
                type: "text/csv"
            });
            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(csvFile);
            downloadLink.download = filename;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
        mapping (data) {
            const fields = this.proxy.fields;
            const mapping = (item, acc, el)=>{
                return {
                    ...acc,
                    [el.key]: item[el.key] || "-"
                };
            };
            return data.map((item)=>fields.filter((el)=>el.checked).reduce((acc, el)=>mapping(item, acc, el), {}));
        }
    },
    created () {
        this.proxy.fields = this.param.fields = this.param.fields.filter((el)=>!el.hidden);
        this.proxy.data = this.method.mapping(this.param.data);
    }
};


var $cca8c45a3f2014f4$export$2e2bcd8739ae039 = {
    template: `<div class="main l-container l-content"></div>`,
    proxies: {
        selectedIndex: 0
    },
    nodes () {
        return {
            main: {
                component: {
                    src: (0, $e4d8ac047ff8b39b$export$2e2bcd8739ae039),
                    proxies: {
                        tabs: this.models.map((el)=>el.title),
                        selectedIndex: ()=>this.proxy.selectedIndex
                    },
                    methods: {
                        change: this.method.switchTab
                    },
                    sections: {
                        content: {}
                    }
                }
            }
        };
    },
    methods: {
        switchTab (n) {
            const key = this.models[n].key;
            const fields = this.models[n].fields;
            const data = this.data.filter((el)=>el.model === key);
            this.node.main.section.content.mount({
                src: (0, $917d4b5ddb6d74b4$export$2e2bcd8739ae039),
                params: {
                    data: data,
                    fields: fields,
                    key: key
                }
            });
            this.proxy.selectedIndex = n;
        }
    },
    mounted () {
        this.method.switchTab(this.proxy.selectedIndex);
    }
};


// import data from './data.json'
// import models from '../../src/options/models'
// import config from '../../config'
window.create = ({ data: data, models: models, config: config })=>{
    const root = document.querySelector("#root");
    const app = lesta.createApp({
        data: data,
        models: models,
        config: config
    });
    app.mount((0, $cca8c45a3f2014f4$export$2e2bcd8739ae039), root, {
        params: {}
    });
};


