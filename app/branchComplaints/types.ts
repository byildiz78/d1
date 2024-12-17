export type BranchComplaint = {
  id: string
  title: string
  description: string
  branchId: string
  branchName: string
  source: string // merkez, tedarikçi, diğer
  priority: string // high, medium, low
  status: string // open, in_progress, pending, resolved
  assignedTo: string
  observers: string[]
  files: string[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  comments: Comment[]
}

export type Comment = {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
  type: 'comment' | 'status' | 'action'
}
