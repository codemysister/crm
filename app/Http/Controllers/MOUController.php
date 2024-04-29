<?php

namespace App\Http\Controllers;

use App\Http\Requests\MOURequest;
use App\Jobs\GenerateMOUJob;
use App\Models\Lead;
use App\Models\MOU;
use App\Models\Partner;
use App\Models\PartnerPIC;
use App\Models\Product;
use App\Models\Referral;
use App\Models\Signature;
use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;

class MOUController extends Controller
{
    public function index()
    {
        $usersProp = User::with('roles')->get();

        return Inertia::render('MOU/Index', compact('usersProp'));
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
            'status'
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


        $lastDataCurrentMonth = MOU::withTrashed()->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)
            ->latest()->first();

        if ($lastDataCurrentMonth == null) {
            $code = "0000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);
        $romanMonth = intToRoman($currentMonth);
        $newCode = "PKS/$latestCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function generateMOUDocx($mou)
    {
        $template = "assets/template/mou.docx";
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
        ]);

        if ($mou->signature_image) {
            $phpWord->setImageValue('signature_image', array('path' => public_path("/storage/$mou->signature_image")));
        }
        if ($mou->partner_pic_signature) {
            $phpWord->setImageValue('pic_signature', array('path' => public_path("/storage/$mou->partner_pic_signature")));
        }

        $fileName = $mou->uuid . '.docx';
        $mou->mou_doc_word = 'mou/' . $fileName;

        $file = $phpWord->save();
        Storage::put('/public/mou/' . $fileName, file_get_contents($file));
        return $mou;
    }

    public function generateMOU($mou)
    {
        try {
            $path = "mou/mou-" . $mou->uuid . ".pdf";

            $mou->mou_doc = "storage/$path";

            $html = view('pdf.mou', ["mou" => $mou])->render();

            $pdf = Browsershot::html($html)
                ->setIncludedPath(config('services.browsershot.included_path'))
                ->showBackground()
                ->headerHtml('<div></div>')
                ->footerHtml('<div style="text-align: right; font-style: italic; font-size: 10px; width:100%; margin-right: 2.5cm; margin-bottom: 1cm;">Perjanjian Kerjasama CAZH | <span class="pageNumber"></span>  </div>')
                ->showBrowserHeaderAndFooter()
                ->pdf();


            Storage::put("public/$path", $pdf);

            return $mou;

        } catch (\Exception $exception) {
            $this->report($exception);
        }
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

        DB::beginTransaction();
        try {
            $code = $this->generateCode();

            $mou = new MOU();
            $mou->uuid = Str::uuid();
            $mou->code = $code;
            $mou->day = $request->day;
            $mou->date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $mou->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $mou->lead_id = $leadExist->id;
            }
            $mou->partner_name = $request->partner['name'];
            $mou->partner_pic = $request->partner['pic'];
            $mou->partner_pic_position = $request->partner['pic_position'];
            $mou->partner_pic_signature = $pathSignaturePic;
            $mou->partner_province = $request->partner['province'];
            $mou->partner_regency = $request->partner['regency'];
            $mou->url_subdomain = $request->url_subdomain;
            $mou->price_card = $request->price_card;
            $mou->price_lanyard = $request->price_lanyard;
            $mou->price_subscription_system = $request->price_subscription_system;
            $mou->period_subscription = $request->period_subscription;
            $mou->price_training_offline = $request->price_training_offline;
            $mou->price_training_online = $request->price_training_online;
            $mou->fee_qris = $request->fee_qris;
            $mou->fee_purchase_cazhpoin = $request->fee_purchase_cazhpoin;
            $mou->fee_bill_cazhpoin = $request->fee_bill_cazhpoin;
            $mou->fee_topup_cazhpos = $request->fee_topup_cazhpos;
            $mou->fee_withdraw_cazhpos = $request->fee_withdraw_cazhpos;
            $mou->fee_bill_saldokartu = $request->fee_bill_saldokartu;
            $mou->bank = $request->partner['bank'];
            $mou->account_bank_number = $request->partner['account_bank_number'];
            $mou->account_bank_name = $request->partner['account_bank_name'];
            $mou->expired_date = Carbon::parse($request->expired_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $mou->profit_sharing = $request->profit_sharing;
            $mou->profit_sharing_detail = $request->profit_sharing_detail;
            $mou->created_by = Auth::user()->id;
            $mou->signature_name = $request->signature['name'];
            $mou->signature_position = $request->signature['position'];
            $mou->signature_image = $request->signature['image'];

            $mou = $this->generateMOUDocx($mou);
            $mou = $this->generateMOU($mou);
            $mou->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah MOU: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

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

        DB::beginTransaction();
        try {
            $mou->day = $request->day;
            $mou->date = Carbon::parse($request->date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $mou->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $mou->lead_id = $leadExist->id;
            }
            $mou->partner_name = $request->partner['name'];
            $mou->partner_pic = $request->partner['pic'];
            $mou->partner_pic_position = $request->partner['pic_position'];
            $mou->partner_pic_signature = $pathSignaturePic;
            $mou->partner_province = $request->partner['province'];
            $mou->partner_regency = $request->partner['regency'];
            $mou->url_subdomain = $request->url_subdomain;
            $mou->price_card = $request->price_card;
            $mou->price_lanyard = $request->price_lanyard;
            $mou->price_subscription_system = $request->price_subscription_system;
            $mou->period_subscription = $request->period_subscription;
            $mou->price_training_offline = $request->price_training_offline;
            $mou->price_training_online = $request->price_training_online;
            $mou->fee_qris = $request->fee_qris;
            $mou->fee_purchase_cazhpoin = $request->fee_purchase_cazhpoin;
            $mou->fee_bill_cazhpoin = $request->fee_bill_cazhpoin;
            $mou->fee_topup_cazhpos = $request->fee_topup_cazhpos;
            $mou->fee_withdraw_cazhpos = $request->fee_withdraw_cazhpos;
            $mou->fee_bill_saldokartu = $request->fee_bill_saldokartu;
            $mou->bank = $request->partner['bank'];
            $mou->account_bank_number = $request->partner['account_bank_number'];
            $mou->account_bank_name = $request->partner['account_bank_name'];
            $mou->expired_date = Carbon::parse($request->expired_date)->setTimezone('GMT+7')->format('Y-m-d H:i:s');
            $mou->profit_sharing = $request->profit_sharing;
            $mou->profit_sharing_detail = $request->profit_sharing_detail;
            $mou->created_by = Auth::user()->id;
            $mou->signature_name = $request->signature['name'];
            $mou->signature_position = $request->signature['position'];
            $mou->signature_image = $request->signature['image'];
            $mou = $this->generateMOUDocx($mou);
            $mou = $this->generateMOU($mou);
            $mou->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah MOU: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
        $this->generateMOUDocx($mou);
        GenerateMOUJob::dispatch($mou);
    }
    public function apiGetMou()
    {
        $mouProp = MOU::with('createdBy', 'partner', 'lead')->latest()->get();
        return response()->json($mouProp);
    }

    public function destroy($uuid)
    {
        $mou = MOU::where('uuid', '=', $uuid)->first();
        Activity::create([
            'log_name' => 'deleted',
            'description' => 'menghapus data mou',
            'subject_type' => get_class($mou),
            'subject_id' => $mou->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "deleted",
            'properties' => [
                "old" => [
                    "code" => $mou->code,
                    "partner_name" => $mou->partner_name,
                    "partner_pic" => $mou->partner_pic,
                    "url_subdomain" => $mou->url_subdomain,
                    "price_card" => $mou->price_card,
                    "price_lanyard" => $mou->price_lanyard,
                    "price_subscription_system" => $mou->price_subscription_system,
                    "period_subscription" => $mou->period_subscription,
                    "fee_qris" => $mou->fee_qris,
                    "fee_purchase_cazhpoin" => $mou->fee_purchase_cazhpoin,
                    "fee_bill_cazhpoin" => $mou->fee_bill_cazhpoin,
                    "fee_topup_cazhpos" => $mou->fee_topup_cazhpos,
                    "fee_withdraw_cazhpos" => $mou->fee_withdraw_cazhpos,
                    "fee_bill_saldokartu" => $mou->fee_bill_saldokartu,
                    "bank" => $mou->bank,
                    "account_bank_number" => $mou->account_bank_number,
                    "account_bank_name" => $mou->account_bank_name,
                    "profit_sharing" => $mou->profit_sharing,
                    "signature_name" => $mou->signature_name
                ]
            ]

        ]);
        $mou->delete();
    }
    public function destroyForce($uuid)
    {
        $mou = MOU::withTrashed()->where('uuid', '=', $uuid)->first();
        Activity::create([
            'log_name' => 'force',
            'description' => 'menghapus permanen data mou',
            'subject_type' => get_class($mou),
            'subject_id' => $mou->id,
            'causer_type' => get_class(Auth::user()),
            'causer_id' => Auth::user()->id,
            "event" => "force",
            'properties' => [
                "old" => [
                    "code" => $mou->code,
                    "partner_name" => $mou->partner_name,
                    "partner_pic" => $mou->partner_pic,
                    "url_subdomain" => $mou->url_subdomain,
                    "price_card" => $mou->price_card,
                    "price_lanyard" => $mou->price_lanyard,
                    "price_subscription_system" => $mou->price_subscription_system,
                    "period_subscription" => $mou->period_subscription,
                    "fee_qris" => $mou->fee_qris,
                    "fee_purchase_cazhpoin" => $mou->fee_purchase_cazhpoin,
                    "fee_bill_cazhpoin" => $mou->fee_bill_cazhpoin,
                    "fee_topup_cazhpos" => $mou->fee_topup_cazhpos,
                    "fee_withdraw_cazhpos" => $mou->fee_withdraw_cazhpos,
                    "fee_bill_saldokartu" => $mou->fee_bill_saldokartu,
                    "bank" => $mou->bank,
                    "account_bank_number" => $mou->account_bank_number,
                    "account_bank_name" => $mou->account_bank_name,
                    "profit_sharing" => $mou->profit_sharing,
                    "signature_name" => $mou->signature_name
                ]
            ]

        ]);
        unlink($mou->mou_doc);
        $mou->forceDelete();
    }

    public function filter(Request $request)
    {
        $mous = MOU::with(['createdBy', 'lead', 'partner']);

        if ($request->user) {
            $mous->where('created_by', $request->user['id']);
        }
        if ($request->institution_type == 'Lead') {
            $mous->orWhereHas('lead');
        } else if ($request->institution_type == 'Partner') {
            $mous->orWhereHas('partner');
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $mous->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $mous = $mous->get();
        return response()->json($mous);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', MOU::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $logs = $logs->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', MOU::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }

    public function apiGetArsip()
    {
        $arsip = MOU::withTrashed()->with(['createdBy', 'lead', 'partner'])->whereNotNull('deleted_at')->get();

        return response()->json($arsip);
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $mou = MOU::withTrashed()->where('uuid', '=', $uuid)->first();
            $mou->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore mou: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

}
