const routes = [
  { path: "", name: "" }
];
const router = new VueRouter({
  routes, // short for `routes: routes`
  mode: "history"
});
Vue.use(VueRouter);

const vm = new Vue({
  vuetify: new Vuetify({
    iconfont: "md",
    theme: {
      primary: "#22b533",
      secondary: "#b0bec5",
      accent: "#8c9eff",
      error: "#b71c1c"
    }
  }),
  router,

  data: {
    search: "",
    app: {
      title: "Machine à café"
    },
    menu: false,
    modal: false,
    menu2: false,
    dialog: false,
    drawer: null,
    e1: 0,
    has_badge: true,
    badge_exist: false,
    boissonImgs: [
      { img: "assets/imgs/the.png", selected: false },
      { img: "assets/imgs/coffe.png", selected: false },
      { img: "assets/imgs/hot-choco.png", selected: false }
    ],
    boissons: [],
    selection: {
      id: 0,
      Id_badge: 1,
      Id_boisson: 2,
      Mug: false,
      Qte_sucre: 2
    },
    lastSelection: {},
    selectedBoisson:{},  
    snackbar: {
      visible: false,
      color: "error",
      mode: "horizontal",      
      timeout: 5000,
      text: "Hello,d a snackbar"
    },
   

   
  },
  computed: {},
  watch: {},
  ready: function() {},
  mounted: function() {
    var $this = this;
    this.getBoissons();
    document.addEventListener("keydown", event => {
      if (event.ctrlKey) {
      }     
    });
  },
  mixins: [mix],
  methods: {
    goTo: function(name, params) {
      this.$router.push({ name: name, params: params });
      location.reload();
    },
    getBoissons() {
      var $this = this;
      $this.boissons = [];
      axios
        .get("http://localhost/CoffeManager/api/cofe_")
        .then(response => {
          $this.boissons = response.data;
          console.log($this.boissons);
        })
        .catch(error => { 
          $this.snackbar.visible = true;
          $this.snackbar.text = error;
        });
    },
    checkBadge(cb) {
      var $this = this;
      axios
        .get(
          "http://localhost/CoffeManager/api/cofe_/getbadge/" +
            this.selection.Id_badge
        )
        .then(response => {
          $this.badge_exist = false;
          if (response.data > 0) {
            $this.badge_exist = true;
          } else {
            $this.snackbar.visible = true;
            $this.snackbar.text = "Vous n’avez encore un numéro de badge ! ";
          }
          cb();
        })
        .catch(error => {
            $this.snackbar.visible = true;
            $this.snackbar.text = error;
        });
    },
    next(tab) {
      var $this = this;
      switch (tab) {
        case 1:
          if ($this.has_badge) {
            $this.checkBadge(function() {
              if ($this.badge_exist) {
                $this.getLastSelection();
                $this.e1 = tab + 1;
              } else {
               
              }
            });
          } else {
            $this.e1 = tab + 1;
            $this.select(1,1); // default seelection whith out badg
          }

          break;
        case 2:
          break;
        case 3:
          this.addSelection();
          break;
      }
    },
    addSelection() {
        var nbdg = 0;
        if (this.has_badge) {
            nbdg =  this.selection.Id_badge ;
        }
      var url =
        "http://localhost/CoffeManager/api/cofe_/addselection/" +
        nbdg +
        "/" +
        this.selection.Id_boisson +
        "/" +
        this.selection.Mug +
        "/" +
        this.selection.Qte_sucre;
      var $this = this;
      axios.get(url).then(response => {
        $this.selection = response.data;
        if ($this.selection.Id > 0) {
          if ($this.has_badge) {
            $this.snackbar.color = "red darken-2";
            $this.snackbar.text = "L’opération s’est bien effectuée ";     
            $this.showAlert()       
          } else {
            $this.snackbar.text =
              "L’opération s’est bien effectuée, votre numéro de badge est :" +
              $this.selection.Id_badge;
          }
          $this.snackbar.visible = true;
        } else {
          $this.snackbar.visible = true;
          $this.snackbar.text = "L’opération a échoué";
        }
      }).catch(error => {
        $this.snackbar.visible = true;
        $this.snackbar.text = error;
    });;
    },
    select(b_id, i) {
        this.selectedBoisson = this.boissonImgs[i];
      this.selection.Id_boisson = b_id;
      this.boissonImgs.forEach(element => {
        element.selected = false;
      });
      this.boissonImgs[i].selected = true;
    },
       
     getLastSelection() {
      var $this = this;
      axios
        .get(
          "http://localhost/CoffeManager/api/cofe_/Get_Last_selection/" +
            this.selection.Id_badge
        )
        .then(response => {
          $this.lastSelection = response.data;         
          $this.select(
            $this.lastSelection.Id_boisson - 1,
            $this.lastSelection.Id_boisson - 1
          );
          $this.selection.Id_boisson = $this.lastSelection.Id_boisson;
          $this.selection.Qte_sucre = $this.lastSelection.Qte_sucre;
        })
        .catch(error => {
            $this.snackbar.visible = true;
            $this.snackbar.text = error;
        });
    }
  }
}).$mount("#app");
