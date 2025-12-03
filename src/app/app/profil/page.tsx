import Label from '@/components/form/Label'
import TextInput from '@/components/form/TextInput'
import PrimaryButton from '@/components/ui/PrimaryButton'

export default function ProfilPage() {
  return (
    <div className="space-y-6 pb-4">
      <div className="bg-white border border-border rounded-2xl p-5 shadow-soft space-y-2">
        <h2 className="text-2xl font-bold">Informations société</h2>
        <p className="text-base text-ink-soft">Ces éléments apparaîtront sur vos devis et factures.</p>
      </div>
      <form className="grid gap-4 max-w-3xl bg-white border border-border rounded-2xl p-5 shadow-soft">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de l'entreprise</Label>
          <TextInput id="name" name="name" placeholder="Maçonnerie Dupont" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse complète</Label>
          <TextInput id="address" name="address" placeholder="12 rue des Pins, 33000 Bordeaux" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="siret">SIRET</Label>
            <TextInput id="siret" name="siret" placeholder="123 456 789 00012" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vat">TVA (optionnel)</Label>
            <TextInput id="vat" name="vat" placeholder="FR12 123456789" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <TextInput id="phone" name="phone" placeholder="06 00 00 00 00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="send-email">Email d'envoi des documents</Label>
            <TextInput id="send-email" name="sendEmail" type="email" placeholder="facturation@votre-entreprise.fr" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo (URL ou upload)</Label>
            <TextInput id="logo" name="logo" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iban">Coordonnées bancaires (IBAN)</Label>
            <TextInput id="iban" name="iban" placeholder="FR76 XXXX XXXX XXXX" />
          </div>
        </div>
        <PrimaryButton type="button" className="text-lg w-full md:w-auto">Enregistrer les paramètres</PrimaryButton>
      </form>
    </div>
  )
}
