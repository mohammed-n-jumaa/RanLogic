<?php

namespace App\Services;

use App\Models\LinkLink;
use Illuminate\Support\Collection;

class LinkService
{
    public function getAll(): Collection
    {
        return LinkLink::ordered()->get();
    }

    public function create(array $data): LinkLink
    {
        $data['order']  = LinkLink::max('order') + 1;
        $data['clicks'] = 0;

        return LinkLink::create($data);
    }

    public function update(LinkLink $link, array $data): LinkLink
    {
        $link->update($data);

        return $link->fresh();
    }

    public function delete(LinkLink $link): void
    {
        $link->delete();
    }

    public function toggle(LinkLink $link): LinkLink
    {
        $link->update(['active' => !$link->active]);

        return $link->fresh();
    }

    public function reorder(array $items): void
    {
        foreach ($items as $item) {
            LinkLink::where('id', $item['id'])->update(['order' => $item['order']]);
        }
    }

    public function recordClick(LinkLink $link): LinkLink
    {
        $link->incrementClicks();

        return $link->fresh();
    }

    private function formatLink(LinkLink $link): array
    {
        return [
            'id'         => (string) $link->id,
            'title'      => $link->title,
            'url'        => $link->url,
            'icon'       => $link->icon,
            'active'     => $link->active,
            'order'      => $link->order,
            'clicks'     => $link->clicks,
            'titleFont'  => $link->title_font,
        ];
    }

    public function formatCollection(Collection $links): array
    {
        return $links->map(fn($l) => $this->formatLink($l))->values()->all();
    }

    public function formatOne(LinkLink $link): array
    {
        return $this->formatLink($link);
    }
}