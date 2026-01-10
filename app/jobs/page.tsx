"use client"

import { useState, useEffect } from "react"
import { PublicHeader } from "@/components/public-header"
import { PublicFooter } from "@/components/public-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Briefcase, Clock, Building2, Heart, Filter, X, Target, DollarSign, Home } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobsPage() {
  const [showFilters, setShowFilters] = useState(true)
  const [salaryRange, setSalaryRange] = useState([200, 2000])
  const [salaryFilterEnabled, setSalaryFilterEnabled] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedContractTypes, setSelectedContractTypes] = useState<string[]>([])
  const [selectedRemoteTypes, setSelectedRemoteTypes] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<string[]>([])
  const jobsPerPage = 10

  useEffect(() => {
    loadJobs()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [allJobs, searchKeyword, searchLocation, sortBy, selectedContractTypes, selectedRemoteTypes, selectedExperience, selectedDateRange, salaryRange, salaryFilterEnabled])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const { offreApi } = await import("@/lib/api-client")
      const data = await offreApi.list({ statut: 'PUBLIEE', per_page: 1000 })
      const offres = data.data || []
      const mappedJobs = offres.map((offre: any) => ({
        id: offre.id,
        title: offre.titre,
        company: offre.entreprise,
        logo: offre.entreprise?.charAt(0) || "💼",
        location: offre.lieu,
        type: offre.type_contrat,
        remote: offre.teletravail === 'total' ? 'Full Remote' : offre.teletravail === 'partiel' ? 'Hybride' : 'Présentiel',
        salary: offre.salaire_min && offre.salaire_max ? `${offre.salaire_min/1000}k-${offre.salaire_max/1000}k FCFA` : 'Selon profil',
        salaryMin: offre.salaire_min || 0,
        salaryMax: offre.salaire_max || 0,
        posted: new Date(offre.created_at).toLocaleDateString('fr-FR'),
        createdAt: new Date(offre.created_at),
        featured: false,
        urgent: false,
        match: Math.floor(Math.random() * 30) + 70,
        skills: offre.offre_competences?.map((oc: any) => oc.competence?.nom).filter(Boolean) || [],
        description: offre.description || '',
      }))
      setAllJobs(mappedJobs)
    } catch (error) {
      console.error('Erreur chargement offres:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...allJobs]

    // Filtre par mot-clé
    if (searchKeyword) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        job.skills.some((skill: string) => skill.toLowerCase().includes(searchKeyword.toLowerCase()))
      )
    }

    // Filtre par localisation
    if (searchLocation) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(searchLocation.toLowerCase())
      )
    }

    // Filtre par type de contrat
    if (selectedContractTypes.length > 0) {
      filtered = filtered.filter(job => selectedContractTypes.includes(job.type))
    }

    // Filtre par télétravail
    if (selectedRemoteTypes.length > 0) {
      filtered = filtered.filter(job => selectedRemoteTypes.includes(job.remote))
    }

    // Filtre par salaire (seulement si activé)
    if (salaryFilterEnabled) {
      filtered = filtered.filter(job => {
        const jobSalaryMin = job.salaryMin / 1000
        const jobSalaryMax = job.salaryMax / 1000
        return (jobSalaryMax === 0 || (jobSalaryMax >= salaryRange[0] && jobSalaryMin <= salaryRange[1]))
      })
    }

    // Filtre par date
    if (selectedDateRange.length > 0) {
      const now = new Date()
      filtered = filtered.filter(job => {
        const daysDiff = Math.floor((now.getTime() - job.createdAt.getTime()) / (1000 * 3600 * 24))
        return selectedDateRange.some(range => {
          if (range === "Dernières 24h") return daysDiff <= 1
          if (range === "Dernière semaine") return daysDiff <= 7
          if (range === "Dernier mois") return daysDiff <= 30
          return true
        })
      })
    }

    // Tri
    if (sortBy === "recent") {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    } else if (sortBy === "salary") {
      filtered.sort((a, b) => b.salaryMax - a.salaryMax)
    } else if (sortBy === "match") {
      filtered.sort((a, b) => b.match - a.match)
    }

    setJobs(filtered)
    setCurrentPage(1)
  }

  const handleSearch = () => {
    applyFiltersAndSort()
  }

  const handleResetFilters = () => {
    setSearchKeyword("")
    setSearchLocation("")
    setSalaryRange([200, 2000])
    setSalaryFilterEnabled(false)
    setSelectedContractTypes([])
    setSelectedRemoteTypes([])
    setSelectedExperience([])
    setSelectedDateRange([])
    setSortBy("relevance")
    setCurrentPage(1)
  }

  const toggleFilter = (value: string, state: string[], setState: (val: string[]) => void) => {
    if (state.includes(value)) {
      setState(state.filter(v => v !== value))
    } else {
      setState([...state, value])
    }
  }

  // Stats dynamiques
  const recentJobsCount = allJobs.filter(job => {
    const daysDiff = Math.floor((new Date().getTime() - job.createdAt.getTime()) / (1000 * 3600 * 24))
    return daysDiff <= 7
  }).length

  const companiesCount = new Set(allJobs.map(job => job.company)).size

  // Pagination
  const totalPages = Math.ceil(jobs.length / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = jobs.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Chargement des offres...</div>
        </main>
        <PublicFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Search Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3">Trouvez votre prochain emploi</h1>
              <p className="text-lg text-muted-foreground">Plus de 50,000 offres d'emploi vous attendent</p>
            </div>

            {/* Search Bar */}
            <Card className="p-4">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Poste, mots-clés..." 
                    className="pl-10 h-12"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="md:col-span-4 relative">
                  <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Ville, région..." 
                    className="pl-10 h-12"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="md:col-span-3">
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary"
                    onClick={handleSearch}
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{recentJobsCount}</span> nouvelles offres cette semaine
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{companiesCount}</span> entreprises recrutent
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-80 flex-shrink-0`}>
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <h2 className="text-xl font-bold">Filtres</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <Card className="p-6 space-y-6">
                  {/* Contract Type */}
                  <div>
                    <h3 className="font-semibold mb-3">Type de contrat</h3>
                    <div className="space-y-2">
                      {["CDI", "CDD", "Freelance", "Stage", "Alternance"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={type}
                            checked={selectedContractTypes.includes(type)}
                            onCheckedChange={() => toggleFilter(type, selectedContractTypes, setSelectedContractTypes)}
                          />
                          <label htmlFor={type} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remote Work */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Télétravail</h3>
                    <div className="space-y-2">
                      {["Full Remote", "Hybride", "Présentiel"].map((remote) => (
                        <div key={remote} className="flex items-center space-x-2">
                          <Checkbox 
                            id={remote}
                            checked={selectedRemoteTypes.includes(remote)}
                            onCheckedChange={() => toggleFilter(remote, selectedRemoteTypes, setSelectedRemoteTypes)}
                          />
                          <label htmlFor={remote} className="text-sm cursor-pointer">
                            {remote}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Salaire mensuel (FCFA)</h3>
                      <Checkbox
                        checked={salaryFilterEnabled}
                        onCheckedChange={(checked) => setSalaryFilterEnabled(!!checked)}
                      />
                    </div>
                    <div className="space-y-4">
                      <Slider
                        value={salaryRange}
                        onValueChange={(value) => {
                          setSalaryRange(value)
                          setSalaryFilterEnabled(true)
                        }}
                        min={200}
                        max={2000}
                        step={50}
                        className="mb-2"
                        disabled={!salaryFilterEnabled}
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{salaryRange[0]}k FCFA</span>
                        <span className="text-muted-foreground">{salaryRange[1]}k FCFA</span>
                      </div>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Niveau d'expérience</h3>
                    <div className="space-y-2">
                      {["Junior (0-2 ans)", "Confirmé (3-5 ans)", "Senior (5+ ans)", "Expert (10+ ans)"].map(
                        (level) => (
                          <div key={level} className="flex items-center space-x-2">
                            <Checkbox id={level} />
                            <label htmlFor={level} className="text-sm cursor-pointer">
                              {level}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Posted Date */}
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-3">Date de publication</h3>
                    <div className="space-y-2">
                      {["Dernières 24h", "Dernière semaine", "Dernier mois", "Tout"].map((date) => (
                        <div key={date} className="flex items-center space-x-2">
                          <Checkbox 
                            id={date}
                            checked={selectedDateRange.includes(date)}
                            onCheckedChange={() => toggleFilter(date, selectedDateRange, setSelectedDateRange)}
                          />
                          <label htmlFor={date} className="text-sm cursor-pointer">
                            {date}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full bg-transparent"
                    onClick={handleResetFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                </Card>
              </div>
            </aside>

            {/* Jobs List */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{jobs.length.toLocaleString('fr-FR')} offres trouvées</h2>
                  <p className="text-sm text-muted-foreground">Mises à jour en temps réel</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="lg:hidden bg-transparent" onClick={() => setShowFilters(true)}>
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                  </Button>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Plus pertinent</SelectItem>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="salary">Salaire décroissant</SelectItem>
                      <SelectItem value="match">Meilleur match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job Cards */}
              <div className="space-y-4">
                {currentJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">Aucune offre ne correspond à vos critères de recherche.</p>
                    <Button variant="outline" className="mt-4" onClick={handleResetFilters}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                ) : currentJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  >
                    {job.featured && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-secondary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-bl-lg">
                        En vedette
                      </div>
                    )}

                    <div className="flex gap-6">
                      {/* Company Logo */}
                      <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl flex-shrink-0">
                        {job.logo}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <Link href={`/jobs/${job.id}`}>
                              <h3 className="font-bold text-xl group-hover:text-primary transition-colors truncate">
                                {job.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground font-medium">{job.company}</span>
                              {job.match && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 ml-2">
                                  <Target className="mr-1 h-3 w-3" />
                                  {job.match}% match
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 hover:text-destructive transition-colors"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Job Details */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Home className="h-4 w-4" />
                            {job.remote}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-foreground">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {job.posted}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.urgent && (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                              Recrutement urgent
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{job.description}</p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button className="bg-gradient-to-r from-primary to-secondary" asChild>
                            <Link href={`/jobs/${job.id}`}>Voir les détails</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href={`/jobs/${job.id}/apply`}>Postuler rapidement</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {currentJobs.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button 
                    variant="outline" 
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                  >
                    Précédent
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant="outline"
                        className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                        onClick={() => {
                          setCurrentPage(pageNum)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentPage(totalPages)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  <Button 
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
