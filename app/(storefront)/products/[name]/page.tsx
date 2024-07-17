import ProductCard from "@/app/components/storefront/ProductCard";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

async function getData(productCategory: string) {
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          id: true,
          images: true,
          price: true,
          description: true,
        },
        where: {
          status: "published",
        },
      });

      return {
        title: "All Products",
        data: data,
      };
    }

    case "men": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          id: true,
          images: true,
          price: true,
          description: true,
        },
        where: {
          status: "published",
          category: "men",
        },
      });

      return {
        title: "Products for Men",
        data: data,
      };
    }

    case "women": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          id: true,
          images: true,
          price: true,
          description: true,
        },
        where: {
          status: "published",
          category: "women",
        },
      });

      return {
        title: "Products for Women",
        data: data,
      };
    }

    case "kids": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          id: true,
          images: true,
          price: true,
          description: true,
        },
        where: {
          status: "published",
          category: "kids",
        },
      });

      return {
        title: "Products for Kids",
        data: data,
      };
    }
    default: {
      return notFound();
    }
  }
}

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  const { data, title } = await getData(params.name);
  return (
    <section>
      <h1 className="font-semibold text-3xl my-5">{title}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
