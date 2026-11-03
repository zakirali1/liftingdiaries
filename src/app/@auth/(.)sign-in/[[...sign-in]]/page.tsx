import { SignIn } from '@clerk/nextjs'
import { Modal } from '@/ui/modal'

export default function Page() {
  return (
    <Modal>
      <SignIn routing="hash" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
    </Modal>
  )
}
