<template>
  <div class="focus-container">
    <div class="focus-card-container">
      <div class="focus-card">
        <div class="title">
          <div class="focused-browsing-logi">
            <img
              alt=""
              src="https://static.overlay-tech.com/assets/c539a9d2-2a3e-45eb-b586-3bcae1f0ccaa.svg"
            />
          </div>
          <p class="focused-browsing-is-active">
            Focused Browsing is active
          </p>
        </div>
        <p class="amet-minim-mollit-non-deserunt-ullamco-e">
          Amet minim mollit non deserunt ullamco est sit
          aliqua dolor do amet sint. Velit officia consequat
          duis enim velit mollit.
        </p>
        <div class="buttons">
          <div class="disable-two">
            <p class="disable">Disable</p>
          </div>
          <div class="more-info">
            <p class="read-docs">Read Docs</p>
          </div>
        </div>
        <div class="project-info">
          <p class="support-this-project">
            Support this project
          </p>
          <p class="support-this-project">
            Why are you in Focused Mode
          </p>
        </div>
      </div>
    </div>
    <div class="quote">
      <p class="amet-minim-mollit-non-deserunt-ullamco">
        <strong
          class="amet-minim-mollit-non-deserunt-ullamco-emphasis-0"
          >“ </strong
        >Amet minim mollit non deserunt ullamco est sit
        aliqua dolor do amet sint. Velit officia consequat
        duis enim velit mollit.<strong
          class="amet-minim-mollit-non-deserunt-ullamco-emphasis-0"
        >
          ”</strong
        >
      </p>
      <p class="probably-someone-year">
        - probably someone, year !&#64;#%
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FocusContainer"
};
</script>

<style lang="scss" scoped>
$black: rgba(0, 0, 0, 1);
$black-2: rgba(19, 19, 19, 1);
$gray: rgba(144, 144, 144, 1);

// Typographies
@mixin inter-12-medium {
  font-family: "Inter";
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
}
@mixin inter-14-medium {
  font-family: "Inter";
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
}
@mixin inter-14-regular {
  font-family: "Inter";
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
}
@mixin inter-14-semi-bold {
  font-family: "Inter";
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
}
@mixin inter-18-medium {
  font-family: "Inter";
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
}

.focus-container {
  background-color: rgba(255, 255, 255, 1);
  padding: 57px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.focus-card-container {
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 61px;
  border-radius: 16px;
  padding: 49px 58px;
  box-shadow: 0 4px 12px 0 rgba(19, 19, 19, 0.15);
  display: flex;
  align-items: center;
}
.focus-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}
.focused-browsing-logi {
  margin-right: 7px;
  padding: 1.54px 1px 1.53px;
  display: flex;
  align-items: center;
}
.focused-browsing-is-active {
  color: $black;
  letter-spacing: -0.27px;
  @include inter-18-medium;
}
.amet-minim-mollit-non-deserunt-ullamco-e {
  height: 60px;
  width: 264px;
  color: $gray;
  display: flex;
  text-align: center;
  margin-bottom: 28px;
  letter-spacing: -0.21px;
  @include inter-14-regular;
}
.buttons {
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.disable-two {
  margin-bottom: 15px;
  border-radius: 6px;
  padding: 9px 104px 8px;
  display: flex;
  align-items: center;
  border: 1px solid $black-2;
}
.disable {
  color: $black-2;
  letter-spacing: -0.21px;
  @include inter-14-semi-bold;
}
.more-info {
  background-color: $black-2;
  border-radius: 6px;
  padding: 10px 94px 9px 95px;
  display: flex;
  align-items: center;
}
.read-docs {
  color: rgba(254, 254, 254, 1);
  letter-spacing: -0.21px;
  @include inter-14-semi-bold;
}
.project-info {
  display: flex;
  align-items: flex-start;
}
.support-this-project {
  color: rgba(135, 135, 135, 1);
  text-align: center;
  text-decoration: underline;
  letter-spacing: -0.18px;
  @include inter-12-medium;
  &:not(:last-of-type) {
    margin-right: 37px;
  }
}
.quote {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.amet-minim-mollit-non-deserunt-ullamco {
  height: 38px;
  width: 432px;
  display: flex;
  text-align: center;
  margin-bottom: 12px;
  color: $gray;
  @include inter-14-regular;
}
.amet-minim-mollit-non-deserunt-ullamco-emphasis-0 {
  color: $black-2;
  letter-spacing: -0.21px;
  @include inter-14-regular;
}
.probably-someone-year {
  color: $black;
  margin-left: 216px;
  letter-spacing: -0.21px;
  @include inter-14-medium;
}
</style>