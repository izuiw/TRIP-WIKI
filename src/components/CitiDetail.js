export default function CitiDetail() {
  this.$target = document.createElement("div");
  this.$target.className = "CitiDetail";

  this.template = () => {};

  this.render = () => {};

  this.setState = (newState) => {
    this.state = newState;
    this.render();
  };

  this.render();
}
