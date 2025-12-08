class Callbacks {
    constructor() {
        this.callbacks = [];
    }

    add(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
            return this.callbacks.length - 1; // return index of the callback
        }
    }

    remove(index) {
        if (index >= 0 && index < this.callbacks.length) {
            this.callbacks.splice(index, 1);
        }
    }

    clear() {
        this.callbacks = [];
    }

    run(...args) {
        this.callbacks.forEach(callback => callback(...args));
    }
}

function trimming(str, target) {
    // start with target
    while (str.startsWith(target)) {
        str = str.slice(target.length);
    }

    // end with target
    while (str.endsWith(target)) {
        str = str.slice(0, -target.length);
    }
    return str;
}

var loadingContentCount = 0;

function loadContentWithoutTag(done = null) {
    $(".include").each(function() {
        if (!!$(this).attr("include")) {
            var $includeObj = $(this);
            $(this).load($(this).attr("include"), function(html) {
                $includeObj.after(html).remove(); // remove the include tag
                loadingContentCount--;
                if (loadingContentCount === 0) {
                    done?.();
                }
            });

            loadingContentCount++;
        }
    });
}

function startAllCarousels() {
    // Start all carousels
    $('.carousel').each(function(i, e) {
        bootstrap.Carousel.getOrCreateInstance(e)?.to(0);
    });
}

const app = Vue.createApp({
    data() {
        return {
            language: 'zh-tw',
            langChanged: new Callbacks(),
            searchQuery: '',
            publicationFilter: {
                year: 'all',
                tag: 'all'
            },
            nowPubPage: 1,
            title: '',
            currentMemberFilter: 'all',
            currentTime: new Date().toLocaleString(),
            window: {
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
            },
            location: location,
            URL: URL,
            info: {
                title: {
                    format: "%s｜%l",
                    subformat: "%n－%t",
                    trimming: ["｜", "－", "|", "-", " "]
                },
                datetime: {
                    default_timezone: 480,
                    parser: {
                        year: "%YEAR%-1911",
                        month: "%MONTH%",
                        day: "%DAY%",
                        hour: "%HOUR%",
                        minute: "%MINUTE%",
                        second: "%SECOND%",
                        timezone: "%TIMEZONE%+480"
                    },
                    format: {
                        year: "民國 %Y 年",
                        month: "%m 月",
                        day: "%d 日",
                        hour: "%H 時",
                        minute: "%M 分",
                        second: "%S 秒",
                        microsecond: "%f 微秒",
                        year_month: "民國 %Y 年 %m 月",
                        month_day: "%m 月 %d 日",
                        year_month_day: "民國 %Y 年 %m 月 %d 日"
                    }
                },
                lab: {
                    name: "",
                    phone: "",
                    email: "",
                    location: "",
                    access_time: "",
                    university: {
                        name: "",
                        logo: "/assets/images/example.png",
                        website: "https://example.com",
                        address: "",
                        phone: ""
                    },
                    college: {
                        name: "",
                        website: "https://example.com"
                    },
                    department: {
                        name: "",
                        website: "https://example.com"
                    },
                    college_department: "",
                    pi: {
                        name: "",
                        title: "",
                        name_title: "",
                        company: "",
                        department: "",
                        company_department: "",
                        team: "",
                        image: "/assets/images/example.png",
                        phone: "",
                        email: "",
                        location: "",
                        location_link: "https://example.com",
                        google_scholar: "https://example.com",
                        description: ""
                    },
                    description: "",
                    members: [
                        {
                            name: "姓名",
                            titles: ["碩一"],
                            image: "assets/default/user.png",
                            email: "for@example.com",
                            email_edu: "lab@mail.edu.tw",
                            research: "詳細研究領域",
                            bio: ""
                        },
                    ]
                },
                nav: [
                    {
                        title: "首頁",
                        link: "/"
                    }, {
                        title: "研究領域",
                        link: "/research/"
                    }, {
                        title: "指導教授",
                        link: "/pi/"
                    }, {
                        title: "其他成員",
                        link: "/members/"
                    }, {
                        title: "研究發表",
                        link: "/publications/"
                    }
                ],
                home: {
                    introduction: {
                        title: "實驗室簡介",
                        content: "",
                        carousel: []
                    }, 
                    // 公告欄
                    announcement: {
                        title: "公告欄",
                        list: [],
                        calendar: {
                            title: "實驗室行事曆",
                            list: []
                        }
                    }, 
                    // 活動花絮
                    activities: {
                        title: "活動花絮",
                        carousel: []
                    }
                },
                research: {
                    title: '研究領域',
                    equipment: {
                        title: '專業設備',
                        carousel: []
                    }
                },
                pi: {
                    bio: {
                        title: '主持教授',
                        education: {
                            title: '學歷',
                            list: []
                        },
                        work: {
                            title: '工作經歷',
                            list: []
                        },
                    }
                },
                members: {
                    title: '實驗室成員',
                    filter: {
                        all: '全部'
                    },
                },
                publications: {
                    title: '文獻發表',
                    search: {
                        placeholder: '搜尋論文...'
                    },
                    filter: {
                        all: '全部',
                        year: '年份',
                        tag: '分類標籤'
                    },
                    list: []
                },
                footer: {
                    contact: {
                        title: "聯絡我們",
                        email: ""
                    },
                    social: {
                        title: "",
                        github: "https://github.com/NTUST-CT-Lab"
                    },
                    links: {
                        title: "相關連結",
                        links: []
                    }
                },
                copyright: "© year lab - company_department"
            }
        }
    },


    methods: {
        changeLanguage(lang) {
            this.language = String(lang).toLowerCase();

            // parse assets/info_{lang}.json to this.info
            fetch(`/assets/info_${this.language}.json`)
                .then(response => response.json())
                .then(data => {
                    this.info = data;
                    this.langChanged.run(this.language);
                })
                .catch(error => console.error('Error loading JSON:', error));
        },
        breaklinableEmail(email) {
            return email.replace(/@/g, '<wbr>@').replace(/\./g, '<wbr>.');
        }
    }, 

    created() {
        // system language detection
        this.langChanged.add((lang) => {
            startAllCarousels();
            document.title = this.info.title.format;
            for(const t of this.info.nav) {
                if(t.link === location.pathname) {
                    this.title = t.title;
                    document.title = this.info.title.format.replace('%s', this.title).replace('%l', this.info.lab.name);
                }
            }

            document.title = document.title.replace('%s', '');
            for (i in this.info.title.trimming) {
                document.title = trimming(document.title, this.info.title.trimming[i]);
            }

            localStorage.setItem('lang', this.language);
        });

        const userLang = localStorage.getItem('lang') || navigator.language || navigator.userLanguage || this.language;
        this.changeLanguage(userLang);
        localStorage.setItem('lang', this.language);

        // change lang attribute in html tag
        document.documentElement.setAttribute('lang', this.language);

        window.onresize = () => {
            this.window.innerWidth = window.innerWidth;
            this.window.innerHeight = window.innerHeight;
        };

        setInterval(() => {
            this.currentTime = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
        }, 1000);
    },
    
});