<!-- routes/password-reset/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Reset password</h1>
<form method="post" use:enhance>
	<label for="email">Email</label>
	<input name="email" id="email" /><br />
	<input type="submit" />
</form>
