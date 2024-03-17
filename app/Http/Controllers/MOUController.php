<?php

namespace App\Http\Controllers;

use App\Http\Requests\MOURequest;
use App\Jobs\GenerateMOUJob;
use App\Models\MOU;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Product;
use App\Models\Referral;
use App\Models\Signature;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MOUController extends Controller
{
    public function index()
    {
        return Inertia::render('MOU/Index');
    }

    public function create()
    {
        $usersProp = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset ($user->roles);
            return $user;
        });
        $partnersProp = Partner::with([
            'pics' => function ($query) {
                $query->latest();
            },
            'subscriptions' => function ($query) {
                $query->latest();
            },
            'price_list' => function ($query) {
                $query->latest();
            },
            'accounts' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            },
        ])->get();
        $signaturesProp = Signature::all();
        $referralsProp = Referral::all();
        return Inertia::render('MOU/Create', compact('partnersProp', 'usersProp', 'signaturesProp', 'referralsProp'));
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }

        $totalDataPerMonth = MOU::whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->count();
        $romanMonth = intToRoman($currentMonth);
        $latestData = "PKS/0000/$romanMonth/$currentYear";
        $lastCode = $latestData ? explode('/', $latestData)[1] : 0;
        $newCode = str_pad((int) $lastCode + $totalDataPerMonth + 1, 4, '0', STR_PAD_LEFT);
        $newCode = "PKS/$newCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function generateMOUDocx($mou)
    {
        $template = "assets/template/mou.docx";


        // if ($mou->partner_pic_signature == null && $mou->referral_signature == null) {
        //     $template = "assets/template/mou_tanpa_ttd_pic_referral.docx";
        // } else if ($mou->referral_signature == null) {
        //     $template = "assets/template/mou_tanpa_ttd_referral.docx";
        if ($mou->partner_pic_signature == null) {
            $template = "assets/template/mou_tanpa_ttd_pic.docx";
        }


        $phpWord = new \PhpOffice\PhpWord\TemplateProcessor($template);
        $phpWord->setValues([
            'code' => $mou->code,
            'day' => $mou->day,
            'date' => Carbon::parse($mou->date)->locale('id')->isoFormat('DD MMMM YYYY'),
            'pic' => $mou->partner_pic,
            'partner' => strtoupper($mou->partner_name),
            'position' => ucwords($mou->partner_pic_position),
            'province' => json_decode($mou->partner_province)->name,
            'regency' => json_decode($mou->partner_regency)->name,
            'nomor_hp' => $mou->partner_phone_number,
            'url_subdomain' => $mou->url_subdomain,
            'price_card' => "Rp" . number_format($mou->price_card, 0, ',', '.'),
            'price_lanyard' => "Rp" . number_format($mou->price_lanyard, 0, ',', '.'),
            'price_subscription_system' => "Rp" . number_format($mou->price_subscription_system, 0, ',', '.'),
            'period_subscription' => $mou->period_subscription,
            'price_training_offline' => "Rp" . number_format($mou->price_training_offline, 0, ',', '.'),
            'price_training_online' => "Rp" . number_format($mou->price_training_online, 0, ',', '.'),
            'fee_qris' => $mou->fee_qris,
            'fee_purchase_cazhpoin' => "Rp" . number_format($mou->fee_purchase_cazhpoin, 0, ',', '.'),
            'fee_bill_cazhpoin' => "Rp" . number_format($mou->fee_bill_cazhpoin, 0, ',', '.'),
            'fee_topup_cazhpos' => "Rp" . number_format($mou->fee_topup_cazhpos, 0, ',', '.'),
            'fee_withdraw_cazhpos' => "Rp" . number_format($mou->fee_withdraw_cazhpos, 0, ',', '.'),
            'fee_bill_saldokartu' => "Rp" . number_format($mou->fee_bill_saldokartu, 0, ',', '.'),
            'bank' => $mou->bank,
            'account_bank_number' => $mou->account_bank_number,
            'account_bank_name' => $mou->account_bank_name,
            'profit_sharing' => $mou->profit_sharing ? "melakukan" : 'tidak melakukan',
            'profit_sharing_detail' => $mou->profit_sharing_detail,
            'expired_date' => Carbon::parse($mou->expired_date)->locale('id')->isoFormat('DD MMMM YYYY'),
            'signature_name' => $mou->signature_name,
            // 'referral' => $mou->referral ? 'Pihak Ketiga' : '',
            // 'referral_name' => $mou->referral_name ?? ""
        ]);

        $phpWord->setImageValue('signature_image', array('path' => public_path("/storage/$mou->signature_image")));
        if ($mou->partner_pic_signature) {
            $phpWord->setImageValue('pic_signature', array('path' => public_path("/storage/$mou->partner_pic_signature")));
        }
        // if ($mou->referral) {
        //     $phpWord->setImageValue('referral_signature', array('path' => public_path("/storage/$mou->referral_signature")));
        // }

        $fileName = $mou->uuid . '.docx';
        $mou->update(['mou_doc_word' => 'mou/' . $fileName]);
        $file = $phpWord->save();
        Storage::put('/public/mou/' . $fileName, file_get_contents($file));
        // $phpWord->saveAs(storage_path('app/public/mou/' . $fileName));
    }

    public function store(MOURequest $request)
    {
        $pathSignaturePic = null;
        if ($request->hasFile('partner.pic_signature')) {
            $file = $request->file('partner.pic_signature');
            $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
            $pathSignaturePic = 'images/tanda_tangan/' . $filename;
            Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        }
        // $pathSignatureReferral = null;
        // if ($request->hasFile('referral_signature')) {
        //     $file = $request->file('referral_signature');
        //     $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
        //     $pathSignatureReferral = 'images/tanda_tangan/' . $filename;
        //     Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        // }

        $id_partner = $request->partner['id'];

        if (!$id_partner) {

            $partnerExists = Partner::where('name', 'like', '%' . $request->partner["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'province' => $request['partner']['province'],
                    'regency' => $request['partner']['regency'],
                    'period' => $request->period_subscription,
                    'status' => "Proses",
                ]);
                PartnerPIC::create([
                    'uuid' => Str::uuid(),
                    'partner_id' => $partner->id,
                    'name' => $request->partner['pic'],
                    'position' => $request->partner['pic_position']
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }

        $code = $this->generateCode();
        $mou = MOU::create([
            "uuid" => Str::uuid(),
            "code" => $code,
            "day" => $request->day,
            "date" => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "partner_id" => $id_partner,
            "partner_name" => $request->partner['name'],
            "partner_pic" => $request->partner['pic'],
            "partner_pic_position" => $request->partner['pic_position'],
            "partner_pic_signature" => $pathSignaturePic,
            "partner_province" => $request->partner['province'],
            "partner_regency" => $request->partner['regency'],
            "url_subdomain" => $request->url_subdomain,
            "price_card" => $request->price_card,
            "price_lanyard" => $request->price_lanyard,
            "price_subscription_system" => $request->price_subscription_system,
            "period_subscription" => $request->period_subscription,
            "price_training_offline" => $request->price_training_offline,
            "price_training_online" => $request->price_training_online,
            "fee_qris" => $request->fee_qris,
            "fee_purchase_cazhpoin" => $request->fee_purchase_cazhpoin,
            "fee_bill_cazhpoin" => $request->fee_bill_cazhpoin,
            "fee_topup_cazhpos" => $request->fee_topup_cazhpos,
            "fee_withdraw_cazhpos" => $request->fee_withdraw_cazhpos,
            "fee_bill_saldokartu" => $request->fee_bill_saldokartu,
            "bank" => $request->bank,
            "account_bank_number" => $request->account_bank_number,
            "account_bank_name" => $request->account_bank_name,
            "expired_date" => Carbon::parse($request->expired_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "profit_sharing" => $request->profit_sharing,
            "profit_sharing_detail" => $request->profit_sharing_detail,
            // "referral" => $request->referral,
            // "referral_name" => $request->referral_name,
            // "referral_signature" => $pathSignatureReferral,
            "created_by" => Auth::user()->id,
            "signature_name" => $request->signature['name'],
            "signature_position" => $request->signature['position'],
            "signature_image" => $request->signature['image'],
            "mou_doc" => ""
        ]);

        $this->generateMOUDocx($mou);
        GenerateMOUJob::dispatch($mou);
    }

    public function edit($uuid)
    {
        $usersProp = User::with([
            'roles' => function ($query) {
                $query->latest();
            }
        ])->get();
        $usersProp->transform(function ($user) {
            $user->position = $user->roles->first()->name;
            $user->user_id = $user->id;
            unset ($user->roles);
            return $user;
        });
        $partnersProp = Partner::with([
            'pics' => function ($query) {
                $query->latest();
            },
            'subscriptions' => function ($query) {
                $query->latest();
            },
            'price_list' => function ($query) {
                $query->latest();
            },
            'accounts' => function ($query) {
                $query->latest();
            },
            'banks' => function ($query) {
                $query->latest();
            },
        ])->get();
        $mou = MOU::with('partner')->where('uuid', '=', $uuid)->first();
        $signaturesProp = Signature::all();
        return Inertia::render('MOU/Edit', compact('mou', 'usersProp', 'partnersProp', 'signaturesProp'));
    }

    public function update(MOURequest $request, $uuid)
    {
        $mou = MOU::where('uuid', '=', $uuid)->first();

        $pathSignaturePic = null;
        if ($request->hasFile('pic_signature')) {
            $file = $request->file('pic_signature');
            if ($file->getClientOriginalName() == 'blob') {
                $pathSignaturePic = $mou->partner_pic_signature;
            } else {
                if ($mou->partner_pic_signature) {
                    Storage::delete('public/' . $mou->partner_pic_signature);
                    $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignaturePic = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
                } else {
                    $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
                    $pathSignaturePic = "images/tanda_tangan/" . $filename;
                    Storage::putFileAs('public/images/tanda_tangan', $file, $filename);

                }
            }
        } else {
            if ($mou->partner_pic_signature) {
                Storage::delete('public/' . $mou->partner_pic_signature);
                $pathSignaturePic = null;
            }
        }

        // $pathSignatureReferral = null;

        // if ($request->hasFile('referral_signature')) {
        //     $file = $request->file('referral_signature');
        //     if ($file->getClientOriginalName() == 'blob') {
        //         $pathSignatureReferral = $mou->referral_signature;
        //     } else {
        //         if ($mou->referral_signature) {
        //             Storage::delete('public/' . $mou->referral_signature);
        //             $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
        //             $pathSignatureReferral = "images/tanda_tangan/" . $filename;
        //             Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        //         } else {
        //             $filename = time() . '_' . rand() . '_' . $request->partner['id'] . '.' . $file->getClientOriginalExtension();
        //             $pathSignatureReferral = "images/tanda_tangan/" . $filename;
        //             Storage::putFileAs('public/images/tanda_tangan', $file, $filename);
        //         }
        //     }
        // } else {
        //     if ($mou->referral_signature) {
        //         Storage::delete('public/' . $mou->referral_signature);
        //         $pathSignatureReferral = null;
        //     }
        // }

        $id_partner = $request->partner['id'];

        if (!$id_partner) {

            $partnerExists = Partner::where('name', 'like', '%' . $request->partner["name"] . '%')->first();
            if (!$partnerExists) {
                $partner = Partner::create([
                    'uuid' => Str::uuid(),
                    'name' => $request['partner']['name'],
                    'province' => $request['partner']['province'],
                    'regency' => $request['partner']['regency'],
                    'period' => $request->period_subscription,
                    'status' => "Proses",
                ]);
                PartnerPIC::create([
                    'uuid' => Str::uuid(),
                    'partner_id' => $partner->id,
                    'name' => $request->partner['pic'],
                    'position' => $request->partner['pic_position']
                ]);
                $id_partner = $partner->id;
            } else {
                $id_partner = $partnerExists->id;
            }
        }


        $mou->update([
            "day" => $request->day,
            "date" => Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "partner_id" => $id_partner,
            "partner_name" => $request->partner['name'],
            "partner_pic" => $request->partner['pic'],
            "partner_pic_position" => $request->partner['pic_position'],
            "partner_province" => $request->partner['province'],
            "partner_regency" => $request->partner['regency'],
            "partner_pic_signature" => $pathSignaturePic,
            "url_subdomain" => $request->url_subdomain,
            "price_card" => $request->price_card,
            "price_lanyard" => $request->price_lanyard,
            "price_subscription_system" => $request->price_subscription_system,
            "period_subscription" => $request->period_subscription,
            "price_training_offline" => $request->price_training_offline,
            "price_training_online" => $request->price_training_online,
            "fee_purchase_cazhpoin" => $request->fee_purchase_cazhpoin,
            "fee_bill_cazhpoin" => $request->fee_bill_cazhpoin,
            "fee_topup_cazhpos" => $request->fee_topup_cazhpos,
            "fee_withdraw_cazhpos" => $request->fee_withdraw_cazhpos,
            "fee_bill_saldokartu" => $request->fee_bill_saldokartu,
            "bank" => $request->bank,
            "account_bank_number" => $request->account_bank_number,
            "account_bank_name" => $request->account_bank_name,
            "expired_date" => Carbon::parse($request->expired_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s'),
            "profit_sharing" => $request->profit_sharing,
            "profit_sharing_detail" => $request->profit_sharing_detail,
            // "referral" => $request->referral,
            // "referral_name" => $request->referral_name,
            // "referral_signature" => $pathSignatureReferral,
            "signature_name" => $request->signature['name'],
            "signature_position" => $request->signature['position'],
            "signature_image" => $request->signature['image'],
        ]);

        $this->generateMOUDocx($mou);
        GenerateMOUJob::dispatch($mou);
    }
    public function apiGetMou()
    {
        $mouProp = MOU::with('user', 'partner')->latest()->get();
        return response()->json($mouProp);
    }

    public function destroy($uuid)
    {
        $mou = MOU::where('uuid', '=', $uuid)->first();
        unlink($mou->mou_doc);
        $mou->delete();
    }
}
