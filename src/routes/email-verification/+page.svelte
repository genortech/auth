<!-- routes/email-verification/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Email verification</h1>
<p>Your email verification link was sent to your inbox (i.e. console).</p>
<h2>Resend verification link</h2>
<form method="post" use:enhance>
	<input type="submit" value="Resend" />
</form>
