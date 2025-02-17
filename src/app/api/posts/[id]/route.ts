import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request, {params}: { params: { id: Number } },
) {
    const { id } = params; // Correctly access params
    console.log("params.id",id)
  return Response.json(await prisma.post.findUnique({
    where: { id: Number(id) },
  }))
}

export async function PUT(
  req: Request,
  { params }: { params: { id: Number } },
) {
  try {
    const { title, content } = await req.json()
    return Response.json(await prisma.post.update({
      where: { id: Number(params?.id) },
      data: { title, content },
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: Number } },
) {
  try {
    console.log("params.id",params.id)
    return Response.json(await prisma.post.delete({
      where: { id: Number(params.id) },
    }))
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    })
  }
}