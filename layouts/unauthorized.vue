<template>
  <div>
    <!-- ---------------------------- ШАПКА ---------------------------- -->
    <b-navbar toggleable type="light" variant="light" tag="header">
      <b-navbar-brand to='/login'>Unlim</b-navbar-brand>
    </b-navbar>
  <!-- ----------------------------- ТЕЛО ----------------------------- -->
    <main class="my-4 mx-2">
      <b-container fluid>
        <nuxt />
      </b-container>
    </main>
  <!-- ---------------------------- ПОДВАЛ ---------------------------- -->
    <b-navbar type="light" variant="light" tag="footer" justified>
      <p class="w-100 text-right text-muted">2019-2020 <strong>amso &copy;</strong></p>
    </b-navbar>
  </div>
</template>

<script>
export default {
  head: {
    link: [
      { rel: 'stylesheet', href: '/unauthorized.css' }
    ]
  }
}
</script>